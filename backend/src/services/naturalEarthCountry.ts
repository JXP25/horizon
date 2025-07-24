import AppDataSource from "../lib/db";
import { Country } from "../entities/naturalEarthCountry";
import { Feature, FeatureCollection, Geometry } from "geojson";

export class CountryService {
 
  static async getCountryByGid(gid: number): Promise<Country | null> {
    const repo = AppDataSource.getRepository(Country);
    return repo.findOne({ where: { gid } });
  }

  static async getAllCountries(): Promise<FeatureCollection> {
    const repo = AppDataSource.getRepository(Country);

    const rows = await repo
      .createQueryBuilder("c")
      .select([
        "c.gid AS gid",
        "c.name_long AS name_long",
        "c.label_x AS label_x",
        "c.label_y AS label_y",
        "ST_AsGeoJSON(c.geom)::json AS geom",
      ])
      .getRawMany();


    const features: Feature<Geometry>[] = rows.map((row) => ({
      type: "Feature",
      geometry: row.geom,
      properties: {
        id: row.gid,
        name: row.name_long,
        label_x: row.label_x,
        label_y: row.label_y,
      },
    }));

    return {
      type: "FeatureCollection",
      features,
      bbox: [-180, -90, 180, 90]
    };
  }
}
