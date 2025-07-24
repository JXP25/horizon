import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "horizon_polygons" })
export class HorizonPolygon {
  @PrimaryColumn({ name: "osm_id", type: "bigint" })
  osmId!: number;

  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "text", nullable: true })
  access?: string;

  @Column({ type: "text", nullable: true, name: "addr:housename" })
  addrHousename?: string;

  @Column({ type: "text", nullable: true, name: "addr:housenumber" })
  addrHousenumber?: string;

  @Column({ type: "text", nullable: true, name: "addr:interpolation" })
  addrInterpolation?: string;

  @Column({ type: "text", nullable: true })
  admin_level?: string;

  @Column({ type: "text", nullable: true })
  aerialway?: string;

  @Column({ type: "text", nullable: true })
  aeroway?: string;

  @Column({ type: "text", nullable: true })
  amenity?: string;

  @Column({ type: "text", nullable: true })
  area?: string;

  @Column({ type: "text", nullable: true })
  barrier?: string;

  @Column({ type: "text", nullable: true })
  bicycle?: string;

  @Column({ type: "text", nullable: true })
  brand?: string;

  @Column({ type: "text", nullable: true })
  bridge?: string;

  @Column({ type: "text", nullable: true })
  boundary?: string;

  @Column({ type: "text", nullable: true })
  building?: string;

  @Column({ type: "text", nullable: true })
  construction?: string;

  @Column({ type: "text", nullable: true })
  covered?: string;

  @Column({ type: "text", nullable: true })
  culvert?: string;

  @Column({ type: "text", nullable: true })
  cutting?: string;

  @Column({ type: "text", nullable: true })
  denomination?: string;

  @Column({ type: "text", nullable: true })
  disused?: string;

  @Column({ type: "text", nullable: true })
  embankment?: string;

  @Column({ type: "text", nullable: true })
  foot?: string;

  @Column({ type: "text", nullable: true, name: "generator:source" })
  generatorSource?: string;

  @Column({ type: "text", nullable: true })
  harbour?: string;

  @Column({ type: "text", nullable: true })
  highway?: string;

  @Column({ type: "text", nullable: true })
  historic?: string;

  @Column({ type: "text", nullable: true })
  horse?: string;

  @Column({ type: "text", nullable: true })
  intermittent?: string;

  @Column({ type: "text", nullable: true })
  junction?: string;

  @Column({ type: "text", nullable: true })
  landuse?: string;

  @Column({ type: "text", nullable: true })
  layer?: string;

  @Column({ type: "text", nullable: true })
  leisure?: string;

  @Column({ type: "text", nullable: true })
  lock?: string;

  @Column({ type: "text", nullable: true, name: "man_made" })
  manMade?: string;

  @Column({ type: "text", nullable: true })
  military?: string;

  @Column({ type: "text", nullable: true })
  motorcar?: string;

  @Column({ type: "text", nullable: true })
  name?: string;

  @Column({ type: "text", nullable: true })
  natural?: string;

  @Column({ type: "text", nullable: true })
  office?: string;

  @Column({ type: "text", nullable: true })
  oneway?: string;

  @Column({ type: "text", nullable: true })
  operator?: string;

  @Column({ type: "text", nullable: true })
  place?: string;

  @Column({ type: "text", nullable: true })
  population?: string;

  @Column({ type: "text", nullable: true })
  power?: string;

  @Column({ type: "text", nullable: true, name: "power_source" })
  powerSource?: string;

  @Column({ type: "text", nullable: true })
  public_transport?: string;

  @Column({ type: "text", nullable: true })
  railway?: string;

  @Column({ type: "text", nullable: true })
  ref?: string;

  @Column({ type: "text", nullable: true })
  religion?: string;

  @Column({ type: "text", nullable: true })
  route?: string;

  @Column({ type: "text", nullable: true })
  service?: string;

  @Column({ type: "text", nullable: true })
  shop?: string;

  @Column({ type: "text", nullable: true })
  sport?: string;

  @Column({ type: "text", nullable: true })
  surface?: string;

  @Column({ type: "text", nullable: true })
  toll?: string;

  @Column({ type: "text", nullable: true })
  tourism?: string;

  @Column({ type: "text", nullable: true, name: "tower:type" })
  towerType?: string;

  @Column({ type: "text", nullable: true })
  tracktype?: string;

  @Column({ type: "text", nullable: true })
  tunnel?: string;

  @Column({ type: "text", nullable: true })
  water?: string;

  @Column({ type: "text", nullable: true })
  waterway?: string;

  @Column({ type: "text", nullable: true })
  wetland?: string;

  @Column({ type: "text", nullable: true })
  width?: string;

  @Column({ type: "text", nullable: true })
  wood?: string;

  @Column({ type: "integer", nullable: true, name: "z_order" })
  zOrder?: number;

  @Column({ type: "real", nullable: true, name: "way_area" })
  wayArea?: number;

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
    spatialFeatureType: "Polygon",
    srid: 3857,
  })
  way: any;
}
