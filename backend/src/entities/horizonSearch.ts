import { Entity, PrimaryColumn, Column, Index } from "typeorm";

@Entity({ name: "horizon_search" })
export class HorizonSearch {
  @PrimaryColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "text" })
  layer!: string;

  @Column({ type: "integer" })
  rank!: number;

  @Column({
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326,
  })
  centroid!: unknown;

  @Column({ type: "tsvector" })
  tsv!: string;

  @Index({ where: "trigram_name IS NOT NULL" })
  @Column({ type: "text", nullable: true })
  trigram_name!: string | null;

  @Column({ type: "jsonb" })
  props!: Record<string, any>;
}
