import { gql } from 'graphql-request';

export const GET_MERCHANTS = gql`
 query GetMerchant($limit: Int, $offset: Int) {
    merchants(limit: $limit, offset: $offset) {
      id
      billingWindow
      createdAt
      grace
      metadataUri
      status
      updatedAt
      
      plans {
        id
        price
        billingInterval
        grace
        status
        createdAt
        updatedAt
        metadataUri
      }
    }
  }
`;

export const GET_MERCHANT_BY_ID = gql`
  query GetMerchantById($id: String!) {
    merchantById(id: $id) {
      id
      metadataUri
      status
      billingWindow
      grace
      createdAt
      updatedAt
      payout {
        id
        chainId
        address
        tokens
      }
      plans {
        id
        price
        billingInterval
        grace
        status
        createdAt
        metadataUri
        updatedAt
        subscriptions {
        id
        }
      }
    }
  }
`;
