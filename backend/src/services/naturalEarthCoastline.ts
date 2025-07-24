import AppDataSource from "../lib/db";
import { Coastline } from "../entities/naturalEarthCoastline";

import { Feature, FeatureCollection, Geometry } from "geojson";

export class CoastlineService {

  static async getCoastlineByGid(gid: number): Promise<Coastline | null> {
    const repo = AppDataSource.getRepository(Coastline);
    return repo.findOne({ where: { gid } });
  }

  static async getBaseCoastlinePolygons(): Promise<FeatureCollection> {
    const repo = AppDataSource.getRepository(Coastline);

    const rows = await repo
      .createQueryBuilder("coast")
      .select([
        "coast.gid AS gid",
        "ST_AsGeoJSON(coast.geom)::json AS geom",
      ])
      .getRawMany();

    const features: Feature<Geometry>[] = rows.map((row) => ({
      type: "Feature",
      geometry: row.geom, 
      properties: {
        id: row.gid,
        
      },
    }));

   
    return {
      type: "FeatureCollection",
      features,
      bbox: [-180, -90, 180, 90]
    };
  }
}
