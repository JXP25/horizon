import AppDataSource from "../lib/db";
import { HorizonPolygon } from "../entities/horizonPolygon";
import { Feature, FeatureCollection, Geometry } from "geojson";

class PolygonService {
  static async getPolygonByOsmId(
    osmId: number
  ): Promise<HorizonPolygon | null> {
    const repo = AppDataSource.getRepository(HorizonPolygon);
    return repo.findOne({ where: { osmId } });
  }

  static async getpolygonsBbox(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number,
    limit: number
  ): Promise<FeatureCollection> {
    const repo = AppDataSource.getRepository(HorizonPolygon);

    const rows = await repo
      .createQueryBuilder("poly")
      .select([
        "poly.osmId AS osmId",
        'poly."addr:housename" AS housename',
        'poly."addr:housenumber" AS housenumber',
        "poly.leisure AS leisure",
        "poly.building AS building",
        "poly.tags::json AS tags",
        `ST_AsGeoJSON(ST_Transform(ST_Buffer(poly.way, -1), 4326))::json AS way`,
      ])
      .where(
        `
        ST_Intersects(
          poly.way,
          ST_Transform(
            ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
            3857
          )
        )
        AND poly.water is null
        AND poly.natural is null
        AND (poly.leisure is not null OR poly.building is not null OR poly.amenity is not null)
      `
      )
      .orderBy("way_area", "DESC")
      .limit(limit)
      .setParameters({ minLon, minLat, maxLon, maxLat })
      .getRawMany();

    const avgHeightPerLevel = 2.8;

    const features: Feature<Geometry>[] = rows.map((row) => {
      const tags = row.tags || {};
      const rawHeight = tags.height;
      const rawLevels = tags["building:levels"];

      let heightInt: number;

      if (rawHeight) {
        heightInt =
          Number((rawHeight as string).replace(/[^\d.]/g, "")) ||
          2 * avgHeightPerLevel;
      } else if (rawLevels !== undefined) {
        const levels = Number((rawLevels as string).replace(/[^\d.]/g, ""));
        const adjustedLevels = isNaN(levels) ? 1 : levels + 1;
        heightInt = adjustedLevels * avgHeightPerLevel;
      } else {
        heightInt = 2 * avgHeightPerLevel;
      }

      return {
        type: "Feature",
        geometry: row.way,
        properties: {
          id: row.osmId,
          housename: row.housename,
          housenumber: row.housenumber,
          leisure: row.leisure,
          heightInt,
          building: row.building,
        },
      };
    });

    return {
      type: "FeatureCollection",
      features,
      bbox: [minLon, minLat, maxLon, maxLat],
    };
  }

  static async getNaturalpolygonsBbox(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number,
    limit: number
  ): Promise<FeatureCollection> {
    const repo = AppDataSource.getRepository(HorizonPolygon);
    const rows = await repo
      .createQueryBuilder("poly")
      .select([
        "poly.osmId AS osmId",
        "poly.name AS name",
        "poly.natural AS natural",
        "poly.water AS water",
        "poly.way_area AS way_area",
        "ST_AsGeoJSON(ST_SimplifyPreserveTopology(ST_Transform(poly.way, 4326),0.00008))::json AS way",
      ])
      .where(
        `ST_Intersects(
         poly.way,
         ST_Transform(
         ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
         3857
         )
        ) AND (poly.leisure = 'park' OR (poly.water is not null AND poly.natural is not null AND poly.boundary is null AND poly.highway is null))`
      )
      .orderBy("way_area", "DESC")
      .limit(limit)
      .setParameters({ minLon, minLat, maxLon, maxLat })
      .getRawMany();

    const features: Feature<Geometry>[] = rows.map((row) => {
      const tags = row.tags || {};

      return {
        type: "Feature",
        geometry: row.way,
        properties: {
          id: row.osmId,
          name: row.name,
          natural: row.natural,
          water: row.water,
        },
      };
    });

    return {
      type: "FeatureCollection",
      features,
      bbox: [minLon, minLat, maxLon, maxLat],
    };
  }

  static async getPolygonsByAmenity(
    amenity: string
  ): Promise<HorizonPolygon[]> {
    const repo = AppDataSource.getRepository(HorizonPolygon);
    return repo.find({ where: { amenity } });
  }
}

export default PolygonService;
