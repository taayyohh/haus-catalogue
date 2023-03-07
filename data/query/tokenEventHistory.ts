import { gql, request } from "graphql-request"
import { HAUS_CATALOGUE_PROXY } from "../../constants/addresses"
import { CHAIN } from "../../constants/network"

export const tokenEventHistory = async (tokenId: string) => {
  const endpoint = "https://api.zora.co/graphql"

  const req = gql`
    query TokenEventHistoryQuery($address: String!, $tokenId: String!, $chain: Chain!) {
      token(token: { address: $address, tokenId: $tokenId }, network: { network: ETHEREUM, chain: $chain }) {
        events(pagination: { limit: 100 }, sort: { sortKey: CREATED, sortDirection: DESC }) {
          transactionInfo {
            blockNumber
            logIndex
            blockTimestamp
            transactionHash
          }
          properties {
            ... on V3ReserveAuctionEvent {
              __typename
              address
              collectionAddress
              eventType
              properties {
                ... on V3ReserveAuctionV1AuctionBidProperties {
                  __typename
                  auction {
                    highestBid
                    highestBidPrice {
                      blockNumber
                      nativePrice {
                        decimal
                      }
                    }
                    highestBidder
                    sellerFundsRecipient
                    seller
                    startTime
                  }
                }
                ... on V3ReserveAuctionV1AuctionCreatedProperties {
                  __typename
                  auction {
                    duration
                    firstBidTime
                    reserve
                    highestBidder
                    highestBid
                    currency
                    seller
                    startTime
                    sellerFundsRecipient
                  }
                }
                ... on V3ReserveAuctionV1AuctionEndedProperties {
                  __typename
                  auction {
                    highestBid
                    highestBidder
                    highestBidPrice {
                      chainTokenPrice {
                        decimal
                      }
                    }
                  }
                }
                ... on V3ReserveAuctionV1AuctionCanceledProperties {
                  __typename
                }
              }
            }
          }
          eventType
          collectionAddress
          tokenId
        }
      }
    }
  `

  const variables = {
    address: HAUS_CATALOGUE_PROXY,
    tokenId,
    chain: CHAIN,
  }

  const tokens: { token: { events: any } } = await request(endpoint, req, variables)
  return tokens.token.events
}
