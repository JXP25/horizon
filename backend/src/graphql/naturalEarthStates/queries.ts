export const queries = `#graphql
  statesBbox(
    minLon: Float!
    minLat: Float!
    maxLon: Float!
    maxLat: Float!
    currentZoom: Float!
  ): JSON

  statesOffline: JSON
`;
