import AppDataSource from "../lib/db";
import { RoadNetworkVertex } from "../entities/horizonRoute";
import { FeatureCollection, Feature, LineString } from "geojson";

export class RouteService {
  static async getRouteBetweenPoints(
    startLon: number,
    startLat: number,
    endLon: number,
    endLat: number
  ): Promise<FeatureCollection> {
    // 1) find the nearest vertices
    const [startNearest] = await AppDataSource.query(`
      SELECT 
        id,
        ST_Distance(
          the_geom,
          ST_Transform(ST_SetSRID(ST_Point($1, $2), 4326), 3857)
        ) AS dist_meters
      FROM horizon_road_network_vertices_pgr
      ORDER BY the_geom <-> ST_Transform(ST_SetSRID(ST_Point($1, $2), 4326), 3857)
      LIMIT 1
    `, [startLon, startLat]);

    const [endNearest] = await AppDataSource.query(`
      SELECT 
        id,
        ST_Distance(
          the_geom,
          ST_Transform(ST_SetSRID(ST_Point($1, $2), 4326), 3857)
        ) AS dist_meters
      FROM horizon_road_network_vertices_pgr
      ORDER BY the_geom <-> ST_Transform(ST_SetSRID(ST_Point($1, $2), 4326), 3857)
      LIMIT 1
    `, [endLon, endLat]);

    if (!startNearest || !endNearest) {
      throw new Error("Could not find nearest vertices for start or end point.");
    }

    // 2) run pgr_dijkstra to get the route sequence
    const routeResult = await AppDataSource.query(`
      WITH route AS (
        SELECT seq, node
        FROM pgr_dijkstra(
          'SELECT id, source, target, length AS cost FROM horizon_road_network',
          $1::integer,
          $2::integer,
          directed := false
        )
        WHERE node <> -1
        ORDER BY seq
      )
      SELECT 
        v.id,
        ST_AsGeoJSON(ST_Transform(v.the_geom, 4326)) AS the_geom
      FROM route r
      JOIN horizon_road_network_vertices_pgr v ON r.node = v.id
      ORDER BY r.seq;
    `, [startNearest.id, endNearest.id]);

    if (!routeResult || routeResult.length === 0) {
      throw new Error("No route found between these points.");
    }

    // 3) build a single LineString from the route node coordinates
    const coords = routeResult.map((row: any) => {
      const geomObj = JSON.parse(row.the_geom); // this is likely a Point
      return geomObj.coordinates;               // [lon, lat]
    });

    const lineFeature: Feature<LineString> = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
      properties: {},
    };

    return {
      type: "FeatureCollection",
      features: [lineFeature],
    };
  }
}
