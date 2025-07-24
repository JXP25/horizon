import { gql } from "@apollo/client";

export const GET_POINTS_IN_BBOX = gql`
  query GetPointsInBbox(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
  ) {
    pointsInBbox(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
    ) {
      osmId
      amenity
      building
      way
    }
  }
`;

export const GET_POINTS_AMENITY_IN_BBOX = gql`
  query GetPointsAmenityInBbox(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
    $amenity: String!
  ) {
    pointsByAmenity(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
      amenity: $amenity
    )
  }
`;


export const GET_AMENITY_IN_BBOX = gql`
  query GetAmenityInBbox(
    $minLon: Float!
    $minLat: Float!
    $maxLon: Float!
    $maxLat: Float!
  ) {
    amenitiesInBbox(
      minLon: $minLon
      minLat: $minLat
      maxLon: $maxLon
      maxLat: $maxLat
    ) {
      name
      count
    }
  }
`;