export const queries = `#graphql
lineByOsmId(osmId: BigInt!): PlanetOsmLine

linesInBbox(
  minLon: Float!
  minLat: Float!
  maxLon: Float!
  maxLat: Float!
): [PlanetOsmLine]

linesByAmenity(amenity: String!): [PlanetOsmLine]
`;
