import { gql } from "@apollo/client";

export const GET_BASE_COASTLINES = gql`
  query coastlines {
    coastlines
  }
`;
