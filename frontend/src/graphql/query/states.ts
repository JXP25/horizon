import { gql } from "@apollo/client";

export const GET_BASE_STATES = gql`
  query statesBbox(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
    $currentZoom: Float!
  ) {
    statesBbox(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
      currentZoom: $currentZoom
    )
  }
`;

export const GET_STATES = gql`
  query statesBbox {
    statesOffline
  }
`;
