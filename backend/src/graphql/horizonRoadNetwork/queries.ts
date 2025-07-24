export const queries = `#graphql
roadByOsmId(osmId: BigInt!): PlanetOsmRoad

roadsBbox(
  minLon: Float!
  minLat: Float!
  maxLon: Float!
  maxLat: Float!
  currentZoom: Float!
): JSON

roadsOffline(
  minLon: Float!
  minLat: Float!
  maxLon: Float!
  maxLat: Float!
): JSON

`;
