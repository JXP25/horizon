export const queries = `#graphql

search(
  text: String!
  mapLon: Float
  mapLat: Float
  limit: Int = 20
): [SearchHit]

`;
