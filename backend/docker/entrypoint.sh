#!/bin/sh
set -e

until pg_isready -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE"; do
  echo "⏳ Waiting for Postgres to be ready..."
  sleep 2
done


echo "=== Starting OSM import with osm2pgsql..."
osm2pgsql \
  --create \
  --slim \
  --hstore \
  --cache 4096 \
  --number-processes 2 \
  -U "$PGUSER" \
  -d "$PGDATABASE" \
  -H "$PGHOST" \
  -P 5432 \
  /data/vector.osm.pbf

echo "=== Step 2: Importing coastline shapefile into PostGIS ==="
shp2pgsql -I -s 4326 /data/coastline/coastline.shp public.natural_earth_coastline \
  | psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE"

echo "=== Step 3: Importing country shapefile into PostGIS ==="
shp2pgsql -I -s 4326 /data/country/country.shp public.natural_earth_country \
  | psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE"


echo "=== Step 4: Importing states shapefile into PostGIS ==="
shp2pgsql -I -s 4326 /data/states/states.shp public.natural_earth_states \
  | psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE"


echo "=== OSM import completed! ==="


echo "=== Step 6: Creating custom unified roads table ==="
psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" <<EOF

DROP TABLE IF EXISTS horizon_road_network CASCADE;

CREATE TABLE horizon_road_network AS
SELECT
  osm_id,
  highway,
  name,
  ref,
  tags,
  way
FROM planet_osm_roads
WHERE highway IN ('motorway','trunk')

UNION

SELECT
  osm_id,
  highway,
  name,
  ref,
  tags,
  way
FROM planet_osm_line
WHERE highway IN ('living_street', 'primary', 'residential', 'secondary', 'tertiary', 'trunk', 'unclassified');

ALTER TABLE horizon_road_network ADD COLUMN id SERIAL PRIMARY KEY;


-- Add scale_rank column
ALTER TABLE horizon_road_network ADD COLUMN scale_rank INTEGER;

-- Populate scale_rank based on highway type
UPDATE horizon_road_network
SET scale_rank = CASE highway
  WHEN 'motorway'       THEN 1
  WHEN 'trunk'          THEN 2
  WHEN 'primary'        THEN 3
  WHEN 'secondary'      THEN 4
  WHEN 'tertiary'       THEN 5
  WHEN 'residential'    THEN 6
  WHEN 'living_street'  THEN 7
  WHEN 'unclassified'   THEN 8
  ELSE 9
END;


CREATE INDEX road_network_gix
  ON horizon_road_network
  USING GIST (way);

EOF

echo "=== Done creating table 'horizon_road_network'! ==="

echo "=== Step 7: Preparing 'horizon_road_network' for pgRouting ==="
psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" <<EOF

CREATE EXTENSION IF NOT EXISTS pgrouting;


ALTER TABLE horizon_road_network
  ALTER COLUMN way
  TYPE geometry(LineString, 3857)
  USING ST_LineMerge(way)::geometry(LineString,3857);

ALTER TABLE horizon_road_network ADD COLUMN id SERIAL PRIMARY KEY;

ALTER TABLE horizon_road_network ADD COLUMN source INTEGER;
ALTER TABLE horizon_road_network ADD COLUMN target INTEGER;

SELECT pgr_createTopology('horizon_road_network', 8, 'way', 'id');

ALTER TABLE horizon_road_network ADD COLUMN length DOUBLE PRECISION;
UPDATE horizon_road_network
  SET length = ST_Length(way);

CREATE INDEX IF NOT EXISTS planet_osm_line_source_idx ON horizon_road_network(source);
CREATE INDEX IF NOT EXISTS planet_osm_line_target_idx ON horizon_road_network(target);

ANALYZE horizon_road_network;

EOF

echo "=== 'horizon_road_network' is now ready for pgRouting ==="

echo "=== Step 8: Creating ordered polygons table for zoom-level detail ==="
psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" <<EOF
DROP TABLE IF EXISTS horizon_polygons;
CREATE TABLE horizon_polygons AS
SELECT *
FROM planet_osm_polygon
ORDER BY way_area DESC;
CREATE INDEX idx_horizon_polygons_way_area_desc ON horizon_polygons (way_area DESC);
CLUSTER horizon_polygons USING idx_horizon_polygons_way_area_desc;
VACUUM FULL horizon_polygons;

EOF

echo "=== 'horizon_polygons' table created! ==="

echo "=== Adding primary keys to any tables missing them ==="

psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" <<EOF

DO \$\$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT c.oid::regclass::text AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname NOT IN (
        'osm2pgsql_properties',
        'spatial_ref_sys',
        -- add more tables you want to skip
        'horizon_road_network'
      )
  LOOP

    IF NOT EXISTS (
      SELECT 1
      FROM pg_index i
      WHERE i.indrelid = r.table_name::regclass
        AND i.indisprimary
    ) THEN

      RAISE NOTICE 'Adding primary key column to table: %', r.table_name;

      EXECUTE format(
        'ALTER TABLE %I ADD COLUMN IF NOT EXISTS id bigserial;',
        r.table_name
      );

      EXECUTE format(
        'ALTER TABLE %I ADD CONSTRAINT %I_pkey PRIMARY KEY (id);',
        r.table_name, r.table_name
      );

    ELSE
      RAISE NOTICE 'Skipping table % because it already has a primary key.', r.table_name;
    END IF;

  END LOOP;
END;
\$\$ LANGUAGE plpgsql;

EOF

echo "=== Step 9: Building planet‑wide search index (horizon_search) ==="
psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" <<'EOF'

---------------------------------------------------------------
-- 0. Extensions & fresh table
---------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

DROP TABLE IF EXISTS horizon_search CASCADE;

CREATE TABLE horizon_search (
  id            BIGINT,
  layer         TEXT,
  rank          INT,
  centroid      geometry(Point,4326),
  tsv           tsvector,
  trigram_name  TEXT,
  props         JSONB
);

---------------------------------------------------------------
-- 1. Natural‑Earth COUNTRY  (rank 1)
---------------------------------------------------------------
INSERT INTO horizon_search (id,layer,rank,centroid,tsv,trigram_name,props)
SELECT
  c.gid,
  'country',
  1,
  ST_Point(c.label_x, c.label_y)::geometry(Point,4326),
  to_tsvector('simple', unaccent(c.name_long)),
  c.name_long,
  jsonb_build_object('iso_a3', c.iso_a3, 'name', c.name_long)
FROM public.natural_earth_country c;

---------------------------------------------------------------
-- 2. Natural‑Earth STATES / provinces  (rank 2)
---------------------------------------------------------------
INSERT INTO horizon_search (id,layer,rank,centroid,tsv,trigram_name,props)
SELECT
  s.gid,
  'state',
  2,
  ST_PointOnSurface(s.geom)::geometry(Point,4326),
  to_tsvector('simple', unaccent(s.name)),
  s.name,
  jsonb_build_object('admin', s.admin, 'name', s.name)
FROM public.natural_earth_states s;

---------------------------------------------------------------
-- 3. OSM POLYGONS  (rank 3)  – NO building prop
---------------------------------------------------------------
INSERT INTO horizon_search (id,layer,rank,centroid,tsv,trigram_name,props)
SELECT
  p.osm_id,
  'polygon',
  3,
  ST_Transform(ST_PointOnSurface(p.way),4326),
  to_tsvector('simple',
      unaccent(coalesce(p.name,'')) || ' ' ||
      unaccent(hstore_to_json(p.tags)::text)),
  coalesce(p.name,''),
  jsonb_build_object('amenity', p.amenity, 'tags', hstore_to_json(p.tags))
FROM planet_osm_polygon p
WHERE p.name IS NOT NULL;

---------------------------------------------------------------
-- 4. OSM LINES (non‑road)  (rank 4)
---------------------------------------------------------------
INSERT INTO horizon_search (id,layer,rank,centroid,tsv,trigram_name,props)
SELECT
  l.osm_id,
  'line',
  4,
  ST_Transform(ST_LineInterpolatePoint(l.way,0.5),4326),
  to_tsvector('simple', unaccent(coalesce(l.name,''))),
  coalesce(l.name,''),
  jsonb_build_object('highway',l.highway,'waterway',l.waterway,'railway',l.railway)
FROM planet_osm_line l
WHERE l.highway IS NULL
  AND l.name IS NOT NULL;

---------------------------------------------------------------
-- 5. Unified ROAD network  (rank 5)
---------------------------------------------------------------
INSERT INTO horizon_search (id,layer,rank,centroid,tsv,trigram_name,props)
SELECT
  r.osm_id,
  'road',
  5,
  ST_Transform(ST_LineInterpolatePoint(r.way,0.5),4326),
  to_tsvector('simple',
      unaccent(coalesce(r.name,'')) || ' ' || unaccent(coalesce(r.ref,''))),
  coalesce(r.name, r.ref, ''),
  jsonb_build_object('highway', r.highway, 'ref', r.ref)
FROM public.horizon_road_network r;

---------------------------------------------------------------
-- 6. OSM POINTS / POIs  (rank 6)
---------------------------------------------------------------
INSERT INTO horizon_search (id,layer,rank,centroid,tsv,trigram_name,props)
SELECT
  pt.osm_id,
  'point',
  6,
  ST_Transform(pt.way,4326)::geometry(Point,4326),
  to_tsvector('simple',
      unaccent(coalesce(pt.name,'')) || ' ' ||
      unaccent(hstore_to_json(pt.tags)::text)),
  coalesce(pt.name,''),
  jsonb_build_object('amenity', pt.amenity, 'tags', hstore_to_json(pt.tags))
FROM planet_osm_point pt
WHERE pt.name IS NOT NULL;

---------------------------------------------------------------
-- 7. Indices
---------------------------------------------------------------
CREATE INDEX idx_horizon_search_centroid  ON horizon_search USING GIST (centroid);
CREATE INDEX idx_horizon_search_tsv       ON horizon_search USING GIN  (tsv);
CREATE INDEX idx_horizon_search_trgm      ON horizon_search USING GIN  (trigram_name gin_trgm_ops);

ANALYZE horizon_search;
EOF
echo "=== 'horizon_search' table built successfully==="


echo "=== Step 10: Add id column if not present ==="
psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" <<'EOF'

ALTER TABLE public.horizon_polygons     ADD COLUMN IF NOT EXISTS grid text[];
ALTER TABLE public.horizon_road_network ADD COLUMN IF NOT EXISTS grid text[];
ALTER TABLE public.natural_earth_coastline ADD COLUMN IF NOT EXISTS grid text[];
ALTER TABLE public.natural_earth_country   ADD COLUMN IF NOT EXISTS grid text[];
ALTER TABLE public.natural_earth_states    ADD COLUMN IF NOT EXISTS grid text[];

EOF

echo "=== Done adding id columns! ==="
