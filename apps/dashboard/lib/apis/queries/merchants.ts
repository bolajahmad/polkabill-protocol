import { gql } from 'graphql-request';

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
        updatedAt
        subscriptions {
        id
        }
      }
    }
  }
`;
