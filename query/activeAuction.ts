import { gql, request } from "graphql-request"
import { HAUS_CATALOGUE_PROXY } from "../constants/addresses"
import {CHAIN} from "../constants/network";

export const activeAuctionQuery = async () => {
  const endpoint = "https://api.zora.co/graphql"

  const req = gql`
    query ActiveAuctionQuery($address: [String!], $chain: Chain!) {
      events(
        where: { collectionAddresses: $address }
        sort: { sortKey: CREATED, sortDirection: ASC }
        pagination: { limit: 10 }
        filter: { eventTypes: V3_RESERVE_AUCTION_EVENT }
        networks: { chain: $chain, network: ETHEREUM }
      ) {
        nodes {
          properties {
            ... on V3ReserveAuctionEvent {
              __typename
              properties {
                ... on V3ReserveAuctionV1AuctionBidProperties {
                  __typename
                  extended
                  firstBid
                  auction {
                    highestBid
                    highestBidder
                  }
                }
              }
            }
          }
          collectionAddress
        }
      }
    }
  `

  const variables = {
    address: HAUS_CATALOGUE_PROXY,
    chain: CHAIN
  }

  const tokens = await request(endpoint, req, variables)
  return tokens.events.nodes
}
