import { gql } from "@apollo/client";

export const GET_POLYGONS_IN_BBOX = gql`
  query polygonsBbox(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
    $limit: Int!
  ) {
    polygonsBbox(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
      limit: $limit
    )
  }
`;

export const GET_NATURAL_POLYGONS_IN_BBOX = gql`
  query naturalPolygonsBbox(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
    $limit: Int!
  ) {
    naturalPolygonsBbox(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
      limit: $limit
    )
  }
`;
