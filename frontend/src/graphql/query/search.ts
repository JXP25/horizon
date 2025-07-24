import { gql } from "@apollo/client";

export const SEARCH = gql`
  query Search(
    $text: String!
    $mapLon: Float
    $mapLat: Float
    $limit: Int = 20
  ) {
    search(text: $text, mapLon: $mapLon, mapLat: $mapLat, limit: $limit) {
      id
      layer
      score
      geom
      props
    }
  }
`;
