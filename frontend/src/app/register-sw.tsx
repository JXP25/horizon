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

        // Check if data already exists
        const existingCoastlines = await db.getAll("natural_earth_coastline");
        const existingCountries = await db.getAll("natural_earth_country");
        const existingStates = await db.getAll("natural_earth_states");

        const [coastlinesRes, countriesRes, statesRes] = await Promise.all([
          existingCoastlines.length === 0
            ? fetchCoastlines()
            : Promise.resolve(null),
          existingCountries.length === 0
            ? fetchCountries()
            : Promise.resolve(null),
          existingStates.length === 0 ? fetchStates() : Promise.resolve(null),
        ]);

        const coastFC = coastlinesRes?.data?.coastlines as FeatureCollection;
        if (
          existingCoastlines.length === 0 &&
          coastFC?.features?.length &&
          coastFC.bbox
        ) {
          const bboxArr = coastFC.bbox as [number, number, number, number];
          const [minLon, minLat, maxLon, maxLat] = bboxArr;

          const tx = db.transaction("natural_earth_coastline", "readwrite");
          (coastFC.features as FeatureWithId[]).forEach((f) => {
            tx.store.put({
              ...f,
              bbox: bboxArr,
              minLon,
              minLat,
              maxLon,
              maxLat,
            });
          });
          await tx.done;
          console.log(`Seeded ${coastFC.features.length} coastlines`);
        }

        const countryFC = countriesRes?.data?.countries as FeatureCollection;
        if (
          existingCountries.length === 0 &&
          countryFC?.features?.length &&
          countryFC.bbox
        ) {
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

        if (
          existingStates.length === 0 &&
          stateFC?.features?.length &&
          stateFC.bbox
        ) {
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
