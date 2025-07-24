import AppDataSource from "../lib/db";
import { PlanetOsmLine } from "../entities/planetOsmLine";

class LineService {
  static async getLineByOsmId(osmId: number): Promise<PlanetOsmLine | null> {
    const repo = AppDataSource.getRepository(PlanetOsmLine);
    return repo.findOne({ where: { osmId } });
  }

  static async getLinesInBbox(
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number
  ): Promise<PlanetOsmLine[]> {
    const repo = AppDataSource.getRepository(PlanetOsmLine);

   
    const geometryColumn = `ST_AsGeoJSON(ST_Transform(line.way, 4326))::json AS way`;

    const rows = await repo
      .createQueryBuilder("line")
      .select([
      "line.osmId AS osmId",
      "line.amenity AS amenity", 
      geometryColumn,
      ])
      .where(
      `ST_Intersects(
         line.way,
         ST_Transform(
         ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
         3857
         )
       ) 
         AND line.highway IN (
         'living_street', 'motorway', 'primary', 'residential', 
         'secondary', 'tertiary', 'trunk', 'unclassified'
         )`
      )
      .setParameters({ minLon, minLat, maxLon, maxLat })
      .limit(8000)
      .getRawMany();

 
    return rows.map((row) => ({
      osmId: row.osmId,
      amenity: row.amenity,
      way: row.way, 
    }));
  }

  static async getLinesByAmenity(amenity: string): Promise<PlanetOsmLine[]> {
    const repo = AppDataSource.getRepository(PlanetOsmLine);
    return repo.find({ where: { amenity } });
  }
}

export default LineService;
