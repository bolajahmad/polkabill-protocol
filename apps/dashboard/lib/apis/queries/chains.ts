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

export const GET_ADMIN_RELAY_REQUESTS = gql`
  query GetRelays($limit: Int, $offset: Int) {
    relays(limit: $limit, offset: $offset) {
      type
      id
      allow
      nonce
      token
      adapter {
        id
        address  
      }
      merchant {
        id
        metadataUri
        payout {
          id
          chainId
          address
        }
      }
    }
  }
`;