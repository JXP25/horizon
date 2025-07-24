import { gql } from "@apollo/client";

export const GET_ROUTE_BETWEEN_POINTS = gql`
  query GetRouteBetweenPoints(
    $startLon: Float!
    $startLat: Float!
    $endLon: Float!
    $endLat: Float!
  ) {
    routeBetweenPoints(
      startLon: $startLon
      startLat: $startLat
      endLon: $endLon
      endLat: $endLat
    ) 
  }
`;
