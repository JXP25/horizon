"use client";
import { useEffect } from "react";
import { getDB, StoredFeature } from "@/lib/db";
import { GET_BASE_COASTLINES } from "@/graphql/query/coastline";
import { GET_BASE_COUNTRIES } from "@/graphql/query/country";
import { GET_STATES } from "@/graphql/query/states";
import { useLazyQuery } from "@apollo/client";
import type { FeatureCollection, Geometry } from "geojson";

type FeatureWithId = StoredFeature; // shorthand

export default function ServiceWorkerRegister() {
  const [fetchCoastlines] = useLazyQuery(GET_BASE_COASTLINES);
  const [fetchCountries] = useLazyQuery(GET_BASE_COUNTRIES);
  const [fetchStates] = useLazyQuery(GET_STATES);

  useEffect(() => {

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw_cached_site.js");
    }

    (async () => {
      try {
        const db = await getDB();

        const [coastlinesRes, countriesRes, statesRes] = await Promise.all([
          fetchCoastlines(),
          fetchCountries(),
          fetchStates(),
        ]);



        const coastFC = coastlinesRes?.data?.coastlines as FeatureCollection;
        if (coastFC?.features?.length && coastFC.bbox) {
          const bboxArr = coastFC.bbox as [number, number, number, number];
          const [minLon, minLat, maxLon, maxLat] = bboxArr;

          const tx = db.transaction("natural_earth_coastline", "readwrite");
          (coastFC.features as FeatureWithId[]).forEach((f) =>
        
            {
              tx.store.put({
              ...f,
              bbox: bboxArr,
              minLon,
              minLat,
              maxLon,
              maxLat,
            })
          }
          );
          await tx.done;
          console.log(`Seeded ${coastFC.features.length} coastlines`);
        }


        const countryFC = countriesRes?.data?.countries as FeatureCollection;
        if (countryFC?.features?.length && countryFC.bbox) {
          const bboxArr = countryFC.bbox as [number, number, number, number];
          const [minLon, minLat, maxLon, maxLat] = bboxArr;

          const tx = db.transaction("natural_earth_country", "readwrite");
          (countryFC.features as FeatureWithId[]).forEach((f) =>
            tx.store.put({
              ...f,
              bbox: bboxArr,
              minLon,
              minLat,
              maxLon,
              maxLat,
            })
          );
          await tx.done;
          console.log(`Seeded ${countryFC.features.length} countries`);
        }

 

       

        const stateFC = statesRes?.data?.statesOffline as FeatureCollection;

    
        
        if (stateFC?.features?.length && stateFC.bbox) {
          const bboxArr = stateFC.bbox as [number, number, number, number];
          const [minLon, minLat, maxLon, maxLat] = bboxArr;

          const tx = db.transaction("natural_earth_states", "readwrite");
          (stateFC.features as FeatureWithId[]).forEach((f) =>
            tx.store.put({
              ...f,
              bbox: bboxArr,
              minLon,
              minLat,
              maxLon,
              maxLat,
            })
          );
          await tx.done;
          console.log(`Seeded ${stateFC.features.length} states`);
        }


      } catch (err) {
        console.error("Offline seeding failed:", err);
      }
    })();
  }, []);

  return null;
}
