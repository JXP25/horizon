export const queries = `#graphql
pointByOsmId(osmId: BigInt!): PlanetOsmPoint

pointsInBbox(
  minLon: Float!
  minLat: Float!
  maxLon: Float!
  maxLat: Float!
): [PlanetOsmPoint]

pointsByAmenity(
  minLon: Float!
  minLat: Float!
  maxLon: Float!
  maxLat: Float!,
  amenity: String!
  ): JSON


amenitiesInBbox(
  minLon: Float!
  minLat: Float!
  maxLon: Float!
  maxLat: Float!
): [Amenity]
`;
