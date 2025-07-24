import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "natural_earth_states" })
export class State {
  @PrimaryGeneratedColumn({ name: "gid" })
  gid!: number;


  @Column({ name: "name", type: "varchar", length: 46, nullable: true })
  name?: string | null;


  @Column({ name: "scalerank", type: "smallint", nullable: true })
  scalerank?: number | null;


  @Column({
    name: "geom",
    type: "geometry",
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
  })
  geom!: string | null;
}
