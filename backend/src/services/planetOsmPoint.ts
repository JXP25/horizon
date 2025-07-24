import AppDataSource from "../lib/db";
import { PlanetOsmPoint } from "../entities/planetOsmPoint";
import { Feature, FeatureCollection, Geometry } from "geojson";

class PointService {
  static async getPointByOsmId(osmId: number): Promise<PlanetOsmPoint | null> {
    const repo = AppDataSource.getRepository(PlanetOsmPoint);
    return repo.findOne({ where: { osmId } });
  }

  static async getPointsInBbox(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number
  ): Promise<PlanetOsmPoint[]> {
    const repo = AppDataSource.getRepository(PlanetOsmPoint);

    const geometryColumn = `ST_AsGeoJSON(ST_Transform(p.way, 4326))::json AS way`;

    const rows = await repo
      .createQueryBuilder("p")
      .select(["p.osmId AS osmId", "p.amenity AS amenity", geometryColumn])
      .where(
        `ST_Within(
           p.way,
           ST_Transform(
             ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
             3857
           )
         )`
      )
      .setParameters({ minLon, minLat, maxLon, maxLat })
      .limit(1000)
      .getRawMany();

    return rows.map((row) => ({
      osmId: row.osmId,
      amenity: row.amenity,
      way: row.way,
    }));
  }

  static async getPointsByAmenity(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number,
    amenity: string
  ): Promise<FeatureCollection> {
    const repo = AppDataSource.getRepository(PlanetOsmPoint);

    const geometryColumn = `ST_AsGeoJSON(ST_Transform(p.way, 4326))::json AS way`;

    const rows = await repo
      .createQueryBuilder("p")
      .select(["p.osmId AS osmId", "p.amenity AS amenity", geometryColumn])
      .where("p.amenity = :amenity")
      .andWhere(
        `ST_Within(
           p.way,
           ST_Transform(
             ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
             3857
           )
         )`
      )
      .setParameters({ amenity, minLon, minLat, maxLon, maxLat })
      .limit(1000)
      .getRawMany();

    const features: Feature<Geometry>[] = rows.map((row) => {
      return {
        type: "Feature",
        geometry: row.way,
        properties: {
          osmId: row.osmId,
          amenity: row.amenity,
        },
      };
    });

    return {
      type: "FeatureCollection",
      features,
      bbox: [minLon, minLat, maxLon, maxLat]
    };
  }

  static async getAmenitiesInBbox(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number
  ): Promise<{ name: string; count: number }[]> {
    const repo = AppDataSource.getRepository(PlanetOsmPoint);

    const amenities = await repo
      .createQueryBuilder("p")
      .select("p.amenity AS amenity")
      .addSelect("COUNT(*) AS count")
      .where(
        `ST_Within(
           p.way,
           ST_Transform(
             ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
             3857
           )
         )`
      )
      .groupBy("p.amenity")
      .setParameters({ minLon, minLat, maxLon, maxLat })
      .getRawMany();

    return amenities.map((row) => ({
      name: row.amenity,
      count: parseInt(row.count, 10),
    }));
  }

}

export default PointService;
