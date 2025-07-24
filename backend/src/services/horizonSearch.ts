import AppDataSource from "../lib/db";
import { HorizonSearch } from "../entities/horizonSearch";

export interface SearchHit {
  id: string;
  layer: string;
  score: number;
  geom: any;                   
  props: Record<string, any>;
}

export class SearchService {
  static async search(
    text: string,
    mapLon: number | null = null,
    mapLat: number | null = null,
    limit = 20
  ): Promise<SearchHit[]> {
    const repo = AppDataSource.getRepository(HorizonSearch);

   
    const lon = mapLon ?? 0;
    const lat = mapLat ?? 0;


    const qb = repo
      .createQueryBuilder("s")
      .select([
        "s.id           AS id",
        "s.layer        AS layer",
        "s.rank         AS pri",                                   
        `ts_rank(s.tsv, websearch_to_tsquery('simple', :text)) * 5   AS txt`,
        `similarity(s.trigram_name, :text) * 3                       AS sim`,
        `(1 / (ST_Distance(s.centroid, ST_SetSRID(ST_MakePoint(:lon,:lat),4326)) + 0.001)) AS dist`,
      
        `(s.rank
          + ts_rank(s.tsv, websearch_to_tsquery('simple', :text))*5
          + similarity(s.trigram_name, :text)*3
          + (1 / (ST_Distance(s.centroid, ST_SetSRID(ST_MakePoint(:lon,:lat),4326))+0.001))
        )                                                           AS score`,
        "ST_AsGeoJSON(s.centroid)::json                              AS geom",
        "s.props        AS props",
      ])
      .where(
        `(s.tsv @@ websearch_to_tsquery('simple', :text)
           OR s.trigram_name % :text)`
      )
      .orderBy("pri", "ASC")          
      .addOrderBy("score", "DESC")   
      .limit(limit)
      .setParameters({ text, lon, lat, limit });

    const rows = await qb.getRawMany();

    return rows.map((r) => ({
      id: r.id,
      layer: r.layer,
      score: Number(r.score),
      geom: r.geom,
      props: r.props,
    }));
  }
}
