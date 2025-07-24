import { gql } from "@apollo/client";

export const GET_ROADS_IN_BBOX = gql`
  query roadsBbox(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
    $currentZoom: Float!
  ) {
    roadsBbox(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
      currentZoom: $currentZoom
    ) 
  }
`;

export const GET_ROADS_OFFLINE = gql`
  query roadsOffline(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
  ) {
    roadsOffline(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
    ) 
  }
`;
