   import { getDB, StoredFeature } from "@/lib/db";

   export type StoreName =
     | "natural_earth_coastline"
     | "natural_earth_states"
     | "natural_earth_country"
     | "horizon_polygons"
     | "horizon_natural_polygons"
     | "horizon_road_network";
   
   export async function queryFeaturesInBbox(
     store: StoreName,
     [vMinLon, vMinLat, vMaxLon, vMaxLat]: [number, number, number, number]
   ) {
     const db  = await getDB();
     const tx  = db.transaction(store, "readonly");
     const idx = tx.store.index("by-minLon");
   
     const upper = IDBKeyRange.upperBound(vMaxLon);
     const features: StoredFeature[] = [];
   
     for (
       let cur = await idx.openCursor(upper);
       cur;
       cur = await cur.continue()
     ) {
       const r = cur.value as StoredFeature;
   
      
       if (
         r.maxLon >= vMinLon &&
         r.minLat <= vMaxLat &&
         r.maxLat >= vMinLat
       ) {
         features.push(r);
       }
     }
     await tx.done;
   
     return {
       type: "FeatureCollection",
       features,
       bbox: [vMinLon, vMinLat, vMaxLon, vMaxLat] as [
         number,
         number,
         number,
         number
       ],
     };
   }
   
 
   export async function getAllFeatures(
     store: StoreName
   ) {
     const db  = await getDB();
     const all = await db.getAll(store) as StoredFeature[];
   
     let minLon =  Infinity,
         minLat =  Infinity,
         maxLon = -Infinity,
         maxLat = -Infinity;
   
     for (const f of all) {
       minLon = Math.min(minLon, f.minLon);
       minLat = Math.min(minLat, f.minLat);
       maxLon = Math.max(maxLon, f.maxLon);
       maxLat = Math.max(maxLat, f.maxLat);
     }
   
     const bbox =
       all.length > 0
         ? ([minLon, minLat, maxLon, maxLat] as [number, number, number, number])
         : ([0, 0, 0, 0] as [number, number, number, number]);
   
     return {
       type: "FeatureCollection",
       features: all,
       bbox,
     };
   }

   export async function deleteRowsByIds(
    idsByStore: Partial<Record<StoreName, (number | string | undefined)[] | undefined>>
  ): Promise<void> {
    const db  = await getDB();
    const stores = Object.keys(idsByStore) as StoreName[];
  
    const tx = db.transaction(stores, "readwrite");
  
    for (const storeName of stores) {
      const idArr = idsByStore[storeName];
      if (!Array.isArray(idArr) || idArr.length === 0) continue;
  
      const os = tx.objectStore(storeName);
  
      for (const raw of idArr) {
        if (raw === null || raw === undefined) continue;
  
        const id = typeof raw === "string" ? Number(raw) : raw;
        if (Number.isNaN(id)) {
          console.warn(`⏭️  Skipping non-numeric id "${raw}" for ${storeName}`);
          continue;
        }
        await os.delete(id);             
      }
    }
    await tx.done;
  }
   