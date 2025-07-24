import { Entity, Column, PrimaryColumn,PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "horizon_road_network" })
export class RoadNetwork {

  @PrimaryGeneratedColumn()
  id!: number;

  @PrimaryColumn({ name: "osm_id", type: "bigint" })
  osmId!: number;

  @Column({ type: "text", nullable: true })
  highway?: string;

  @Column({ type: "text", nullable: true })
  name?: string;

  @Column({ type: "text", nullable: true })
  ref?: string;

  @Column({
    type: "hstore",
    hstoreType: "object",
    nullable: true,
    transformer: {
      to: (value: Record<string, string>) => value,
      from: (value: any) => value as Record<string, string>,
    },
  })
  tags?: Record<string, string>;

  @Column({
    name: "way",
    type: "geometry",
    spatialFeatureType: "LineString",
    srid: 3857,
  })
  way: any;
}
