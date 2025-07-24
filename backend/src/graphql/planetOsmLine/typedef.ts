export const typeDefs = `#graphql
scalar BigInt
scalar JSON

type PlanetOsmLine {
  osmId: BigInt
  amenity: String
  building: String
  way: JSON
}

`;
