export const typeDefs = `#graphql
scalar BigInt
scalar JSON


type SearchHit {
  id: BigInt         
  layer: String      
  score: Float
  geom: JSON        
  props: JSON        
}


`;
