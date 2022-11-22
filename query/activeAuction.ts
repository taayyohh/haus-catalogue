import { gql, request } from "graphql-request"
import { HAUS_CATALOGUE_PROXY } from "../constants/addresses"
import { CHAIN } from "../constants/network"

const endpoint = "https://api.zora.co/graphql"

export const activeAuctionQuery = async () => {
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
    chain: CHAIN,
  }

  const tokens = await request(endpoint, req, variables)
  return tokens.events.nodes
}

export const activeAuctionStartBlock = async (tokenId: string) => {
  const req = gql`
    query isActiveAuctionQuery($address: String!, $tokenId: String!, $chain: Chain!) {
      market(
        where: {
          marketType: ACTIVE_V3_RESERVE_AUCTION
          collectionAddress: $address
          token: { address: $address, tokenId: $tokenId }
        }
        network: { network: ETHEREUM, chain: $chain }
      ) {
        transactionInfo {
          blockNumber
        }
      }
    }
  `

  const variables = {
    address: HAUS_CATALOGUE_PROXY,
    chain: CHAIN,
    tokenId,
  }

  const data = await request(endpoint, req, variables)
  return data.market.transactionInfo.blockNumber
}
