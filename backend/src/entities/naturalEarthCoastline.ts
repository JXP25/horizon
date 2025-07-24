import {
    Entity,
    PrimaryGeneratedColumn,
    Column
  } from "typeorm";
  
  @Entity({ name: "natural_earth_coastline" })
  export class Coastline {
    @PrimaryGeneratedColumn({ name: "gid" })
    gid!: number;
  
    @Column({
      name: "featurecla",
      type: "varchar",
      length: 11,
      nullable: true,
    })
    featurecla?: string | null;
  
    @Column({
      name: "scalerank",
      type: "smallint",
      nullable: true,
    })
    scalerank?: number | null;
  
    @Column({
      name: "min_zoom",
      type: "double precision",
      nullable: true,
    })
    min_zoom?: number | null;
  
    @Column({
      name: "geom",
      type: "geometry",
      spatialFeatureType: "MultiPolygon",
      srid: 4326,
      nullable: true,
    })
    geom!: string | null;
  }
  