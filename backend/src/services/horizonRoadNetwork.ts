import { Feature, FeatureCollection, Geometry } from "geojson";
import AppDataSource from "../lib/db";
import { RoadNetwork } from "../entities/horizonRoadNetwork";

export class RoadService {
  static async getRoadByOsmId(osmId: number): Promise<RoadNetwork | null> {
    const repo = AppDataSource.getRepository(RoadNetwork);
    return repo.findOne({ where: { osmId } });
  }

  static async getRoadsInBbox(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number,
    currentZoom: number
  ): Promise<FeatureCollection> {
    const repo = AppDataSource.getRepository(RoadNetwork);

    let zoom = Math.round(currentZoom * 10) / 10;
    
    let rank: number;

    if (zoom >= 14) {
      rank = 9;
    } else if (zoom >= 13) {
      rank = 5;
    } else if (zoom >= 12) {
      rank = 4;
    } else if (zoom >= 11) {
      rank = 3;
    } else if (zoom >= 8.5) {
      rank = 2;
    } else if (zoom >= 6) {
      rank = 1;
    } else {
      rank = 0;
    }

    const rows = await repo
      .createQueryBuilder("road")
      .select([
        "road.id AS id",
        "road.osmId AS osmId",
        "road.highway AS highway",
        "road.ref AS ref",
        "road.name AS name",
        "road.tags AS tags",
        `ST_AsGeoJSON(ST_Simplify(ST_Transform(road.way, 4326),0.00005))::json AS way`,
      ])
      .where(`
        ST_Intersects(
          road.way,
          ST_Transform(
            ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
            3857
          )
        ) and road.scale_rank <= :rank
      `)
      .limit(25000)
      .setParameters({ minLon, minLat, maxLon, maxLat, rank })
      .getRawMany();

    const features: Feature<Geometry>[] = rows.map((row) => ({
      type: "Feature",
      geometry: row.way,  
      properties: {
        id: row.id,
        osmId: row.osmId,
        highway: row.highway,
        ref: row.ref,
        name: row.name,
        tags: row.tags,
      },
    }));

    return {
      type: "FeatureCollection",
      features,
      bbox: [minLon, minLat, maxLon, maxLat]
    };
  }

  static async getRoadsOffline(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number
  ): Promise<FeatureCollection> {
    const repo = AppDataSource.getRepository(RoadNetwork);


    const rows = await repo
      .createQueryBuilder("road")
      .select([
        "road.id AS id",
        "road.osmId AS osmId",
        "road.highway AS highway",
        "road.ref AS ref",
        "road.name AS name",
        "road.tags AS tags",
        `ST_AsGeoJSON(ST_Simplify(ST_Transform(road.way, 4326),0.00005))::json AS way`,
      ])
      .where(`
        ST_Intersects(
          road.way,
          ST_Transform(
            ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
            3857
          )
        )
      `)
      .setParameters({ minLon, minLat, maxLon, maxLat })
      .getRawMany();

    const features: Feature<Geometry>[] = rows.map((row) => ({
      type: "Feature",
      geometry: row.way,  
      properties: {
        id: row.id,
        osmId: row.osmId,
        highway: row.highway,
        ref: row.ref,
        name: row.name,
        tags: row.tags,
      },
    }));

    return {
      type: "FeatureCollection",
      features,
      bbox: [minLon, minLat, maxLon, maxLat]
    };
  }


}

export default RoadService;
