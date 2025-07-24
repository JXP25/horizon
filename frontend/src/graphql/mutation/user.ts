import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $email: String!
    $password: String!
  ) {
    createUser(firstName: $firstName, email: $email, password: $password)
  }
`;
