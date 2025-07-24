export const typeDefs = `#graphql
scalar BigInt
scalar JSON
type PlanetOsmPoint {
  osmId: BigInt
  amenity: String
  building: String
  way: JSON
}

type Amenity {
  name: String
  count: Int
}



`;
