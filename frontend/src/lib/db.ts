import { openDB, DBSchema, IDBPDatabase } from "idb";
import type { Feature, Geometry } from "geojson";

type BBoxArr = [number, number, number, number];

export interface StoredFeature extends Feature<Geometry, { id: number }> {
  bbox: BBoxArr;
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

type Store = {
  key: number;
  value: StoredFeature;
  indexes: { "by-minLon": number };
};

interface HorizonDB extends DBSchema {
  natural_earth_coastline: Store;
  natural_earth_states: Store;
  natural_earth_country: Store;
  horizon_polygons: Store;
  horizon_natural_polygons: Store;
  horizon_road_network: Store;
  planet_osm_points: Store;
}

let dbPromise: Promise<IDBPDatabase<HorizonDB>>;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<HorizonDB>("horizon-offline-db", 1, {
      upgrade(db) {
        const coast = db.createObjectStore("natural_earth_coastline", {
          keyPath: "properties.id",
        });
        coast.createIndex("by-minLon", "minLon");

        const states = db.createObjectStore("natural_earth_states", {
          keyPath: "properties.id",
        });
        states.createIndex("by-minLon", "minLon");

        const country = db.createObjectStore("natural_earth_country", {
          keyPath: "properties.id",
        });
        country.createIndex("by-minLon", "minLon");

        const polys = db.createObjectStore("horizon_polygons", {
          keyPath: "properties.id",
        });
        polys.createIndex("by-minLon", "minLon");

        const naturalPolys = db.createObjectStore("horizon_natural_polygons", {
          keyPath: "properties.id",
        });
        naturalPolys.createIndex("by-minLon", "minLon");

        const roads = db.createObjectStore("horizon_road_network", {
          keyPath: "properties.id",
        });
        roads.createIndex("by-minLon", "minLon");
      },
    });
  }
  return dbPromise;
}
