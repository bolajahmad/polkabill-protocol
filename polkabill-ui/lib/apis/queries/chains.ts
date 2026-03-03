import { gql } from "graphql-request";

export const GET_ADAPTERS = gql`
  query GetAdapters($limit: Int, $offset: Int) {
    adapters(limit: $limit, offset: $offset) {
      address
      createdAt
      id
      status
      tokens
      updatedAt
      charges {
        id
      }
    }
  }
`;