import { gql } from "@apollo/client";

export const GET_USER_TOKEN = gql`
  query Query($email: String!, $password: String!) {
    getUserToken(email: $email, password: $password)
  }
`;

