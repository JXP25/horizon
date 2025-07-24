import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "natural_earth_country" })
export class Country {
  @PrimaryGeneratedColumn({ name: "gid" })
  gid!: number;

  @Column({ name: "name_long", type: "varchar", length: 36, nullable: true })
  name_long?: string | null;

  @Column({ name: "label_x", type: "double precision", nullable: true })
  label_x?: number | null;

  @Column({ name: "label_y", type: "double precision", nullable: true })
  label_y?: number | null;

  @Column({
    name: "geom",
    type: "geometry",
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
  })
  geom!: string | null;
}
