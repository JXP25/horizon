import { gql } from "@apollo/client";

export const GET_NODES_IN_BBOX = gql`
  query GetNodesInBbox(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
  ) {
    nodesInBbox(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
    ) {
      id
      lat
      lon
      tags
    }
  }
`;
