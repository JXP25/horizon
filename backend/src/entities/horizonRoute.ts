import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { Point } from "geojson";

@Entity("road_network_vertices_pgr")
@Index("idx_road_network_vertices_geom", ["the_geom"], { spatial: true })
export class RoadNetworkVertex {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column("integer", { nullable: false })
  cnt?: number;

  @Column("integer", { nullable: false })
  chk?: number;

  @Column("integer", { nullable: false })
  ein?: number;

  @Column("integer", { nullable: false })
  eout?: number;

  @Column({
    type: "geometry",  
    spatialFeatureType: "Point",
    srid: 3857,
    nullable: false,
  })
  the_geom!: Point;
}
