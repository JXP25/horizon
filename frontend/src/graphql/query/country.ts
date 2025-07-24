import { gql } from "@apollo/client";

export const GET_BASE_COUNTRIES = gql`
  query countries {
    countries
  }
`;
