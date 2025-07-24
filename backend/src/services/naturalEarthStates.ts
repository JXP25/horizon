import AppDataSource from "../lib/db";
import { State } from "../entities/naturalEarthStates";
import { Feature, FeatureCollection, Geometry } from "geojson";

export class StateService {
  static async getStatesInBbox(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number,
    currentZoom: number
  ): Promise<FeatureCollection> {
    const repo = AppDataSource.getRepository(State);

    const roundedZoom = Math.round(currentZoom) + 2;

    const rows = await repo
      .createQueryBuilder("s")
      .select([
        "s.gid AS gid",
        "s.name AS name",
        "ST_AsGeoJSON(s.geom)::json AS geom",
        "ST_AsGeoJSON(ST_PointOnSurface(s.geom))::json AS label_geom"
      ])
      .where(
        `ST_Intersects(
           s.geom,
           ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326)
         )
         AND s.scalerank <= :roundedZoom`
      )
      .setParameters({ minLon, minLat, maxLon, maxLat, roundedZoom })
      .getRawMany();

    const features: Feature<Geometry>[] = rows.map((row) => ({
      type: "Feature",
      geometry: row.geom,
      properties: {
        id: row.gid,
        name: row.name,
        labelGeom: row.label_geom,
      },
    }));

    return {
      type: "FeatureCollection",
      features,
      bbox: [minLon, minLat, maxLon, maxLat]
    };
  }

  static async getOfflineStates(): Promise<FeatureCollection> {
      const repo = AppDataSource.getRepository(State);
  
      const rows = await repo
        .createQueryBuilder("state")
        .select([
          "state.gid AS gid",
          "state.name AS name",
          "ST_AsGeoJSON(state.geom)::json AS geom",
          "ST_AsGeoJSON(ST_PointOnSurface(state.geom))::json AS label_geom"
        ])
        .getRawMany();
  
      const features: Feature<Geometry>[] = rows.map((row) => ({
        type: "Feature",
        geometry: row.geom, 
        properties: {
          id: row.gid,
          name: row.name,
        labelGeom: row.label_geom,
        },
      }));
  
     
      return {
        type: "FeatureCollection",
        features,
        bbox: [-180, -90, 180, 90]
      };
    }
 
}
