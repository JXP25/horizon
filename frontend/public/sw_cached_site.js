"use strict";

const cacheName = "v2-site";

self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log("Service Worker: Existing caches:", cacheNames);
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

function openFeatureDB() {
  return new Promise((res, rej) => {
    const rq = indexedDB.open("horizon-offline-db", 1);
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
}

async function getAllFromStore(storeName) {
  try {
    const db = await openFeatureDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const rq = store.getAll();
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
    });
  } catch (error) {
    console.error(`Error getting data from store ${storeName}:`, error);
    return [];
  }
}

async function getIntersecting(storeName, vars) {
  try {
    const all = await getAllFromStore(storeName);
    return all.filter(
      (r) =>
        r.minLon <= vars.maxLon &&
        r.maxLon >= vars.minLon &&
        r.minLat <= vars.maxLat &&
        r.maxLat >= vars.minLat
    );
  } catch (error) {
    console.error(
      `Error getting intersecting data from store ${storeName}:`,
      error
    );
    return [];
  }
}

function makeFC(features, vars) {
  return {
    type: "FeatureCollection",
    features,
    bbox: [vars.minLon, vars.minLat, vars.maxLon, vars.maxLat],
  };
}

async function handleGraphQLRequest(request) {
  let body;
  try {
    body = await request.clone().json();
  } catch {
    body = {};
  }
  const op = body.operationName;
  const vars = body.variables || {};

  // Try online first if available
  if (navigator.onLine) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      // Silently fall back to offline data - this is expected behavior
      // console.error("Service worker fetch error:", error);
    }
  }

  // Fallback to offline data
  console.log(`SW fallback for ${op} via IndexedDB`);

  try {
    let fc;
    switch (op) {
      case "statesBbox":
        fc = makeFC(await getIntersecting("natural_earth_states", vars), vars);
        return new Response(JSON.stringify({ data: { statesBbox: fc } }), {
          headers: { "Content-Type": "application/json" },
        });

      case "polygonsBbox":
        fc = makeFC(await getIntersecting("horizon_polygons", vars), vars);
        return new Response(JSON.stringify({ data: { polygonsBbox: fc } }), {
          headers: { "Content-Type": "application/json" },
        });

      case "naturalPolygonsBbox":
        fc = makeFC(
          await getIntersecting("horizon_natural_polygons", vars),
          vars
        );
        return new Response(
          JSON.stringify({ data: { naturalPolygonsBbox: fc } }),
          { headers: { "Content-Type": "application/json" } }
        );

      case "roadsBbox":
        fc = makeFC(await getIntersecting("horizon_road_network", vars), vars);
        return new Response(JSON.stringify({ data: { roadsBbox: fc } }), {
          headers: { "Content-Type": "application/json" },
        });

      case "coastlines":
        fc = {
          type: "FeatureCollection",
          features: await getAllFromStore("natural_earth_coastline"),
        };
        return new Response(JSON.stringify({ data: { coastlines: fc } }), {
          headers: { "Content-Type": "application/json" },
        });

      case "countries":
        fc = {
          type: "FeatureCollection",
          features: await getAllFromStore("natural_earth_country"),
        };
        console.log("SW: countries", fc);
        return new Response(JSON.stringify({ data: { countries: fc } }), {
          headers: { "Content-Type": "application/json" },
        });

      case "GetAmenityInBbox":
        // Return empty amenities array for offline fallback
        return new Response(JSON.stringify({ data: { amenitiesInBbox: [] } }), {
          headers: { "Content-Type": "application/json" },
        });

      default:
        return new Response(JSON.stringify({ data: {} }), {
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Error handling GraphQL request:", error);
    return new Response(JSON.stringify({ data: {} }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname === "/graphql" && request.method === "POST") {
    event.respondWith(handleGraphQLRequest(request));
  } else {
    // Only cache GET requests, not POST requests
    if (request.method === "GET") {
      event.respondWith(
        fetch(event.request)
          .then((res) => {
            const resClone = res.clone();
            caches.open(cacheName).then((cache) => {
              cache.put(event.request, resClone);
            });
            return res;
          })
          .catch((err) => caches.match(event.request).then((res) => res))
      );
    } else {
      // For non-GET requests, just fetch without caching
      event.respondWith(fetch(event.request));
    }
  }
});
