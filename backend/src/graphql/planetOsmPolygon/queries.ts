export const queries = `#graphql
polygonByOsmId(osmId: BigInt!): PlanetOsmPolygon

polygonsBbox(
  minLon: Float!
  minLat: Float!
  maxLon: Float!
  maxLat: Float!
  limit: Int!
): JSON

naturalPolygonsBbox(
  minLon: Float!
  minLat: Float!
  maxLon: Float!
  maxLat: Float!
  limit: Int!
): JSON

polygonsByAmenity(amenity: String!): [PlanetOsmPolygon]
`;
