import { gql, request } from "graphql-request"

export const activeAuctionQuery = async () => {
  const endpoint = "https://api.zora.co/graphql"

  const req = gql`
    query ActiveAuctionQuery {
      events(
        where: { collectionAddresses: "0x3da452152183140f1eb94b55a86f1671d51d63f4" }
        sort: { sortKey: CREATED, sortDirection: ASC }
        pagination: { limit: 10 }
        filter: { eventTypes: V3_RESERVE_AUCTION_EVENT }
        networks: { chain: GOERLI, network: ETHEREUM }
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

  const tokens = await request(endpoint, req)
  return tokens.events.nodes
}
