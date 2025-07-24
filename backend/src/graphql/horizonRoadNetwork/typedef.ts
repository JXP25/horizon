export const typeDefs = `#graphql
scalar BigInt
scalar JSON

type PlanetOsmRoad {
  id: ID
  name: String
  highway: String
  osmId: BigInt
  ref: String
  tags: JSON
  way: JSON
}

`;
