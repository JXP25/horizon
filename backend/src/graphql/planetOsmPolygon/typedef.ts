export const typeDefs = `#graphql
scalar BigInt
scalar JSON

type PlanetOsmPolygon {
  osmId: BigInt
  housename: String
  housenumber: String
  leisure: String
  building: String
  tags: JSON
  way: JSON
}

type PlanetNaturalOsmPolygon {
  osmId: BigInt
  name: String
  natural: String
  water: String
  way: JSON
}

`;
