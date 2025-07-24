# ---------------------------------------------------------------------------

# Mini Documentation on my codebase prepared for repeated setups and deployments.

# ---------------------------------------------------------------------------

To reset: docker-compose down -v

For Production:

1. Ensure docker services are up and running on system
2. docker-compose build
3. docker-compose up

or use 
docker-compose up --build

# Download uk-latest.osm.pbf from https://download.geofabrik.de/europe.html, other required files are already in git.
To only import data: 
docker-compose up osm_import --build



For Development:

1. docker-compose up cloudbeaver -d
2. pnpm dev

# TypeORM connected to Postgres -> this will indicate correct startup
