import { gql, request } from "graphql-request"
import { HAUS_CATALOGUE_PROXY } from "../constants/addresses"
import { CHAIN } from "../constants/network"

export const discographyQuery = async () => {
  const endpoint = "https://api.zora.co/graphql"

  const req = gql`
    query DiscographyQuery($address: [String!], $chain: Chain!) {
      tokens(
        networks: { chain: $chain, network: ETHEREUM }
        where: { collectionAddresses: $address }
        pagination: { limit: 100 }
        sort: { sortKey: TOKEN_ID, sortDirection: DESC }
      ) {
        nodes {
          token {
            tokenId
            tokenUrl
            metadata
            mintInfo {
              originatorAddress
              toAddress
            }
            owner
            name
            lastRefreshTime
            description
            image {
              url
              size
              mimeType
              mediaEncoding {
                ... on ImageEncodingTypes {
                  large
                  poster
                }
                ... on AudioEncodingTypes {
                  large
                  original
                }
              }
            }
            collectionName
            collectionAddress
            content {
              mediaEncoding {
                ... on ImageEncodingTypes {
                  large
                  poster
                }
                ... on AudioEncodingTypes {
                  large
                }
              }
              url
              size
              mimeType
            }
          }
        }
      }
    }
  `
  const variables = {
    address: HAUS_CATALOGUE_PROXY,
    chain: CHAIN,
  }

  const tokens = await request(endpoint, req, variables)
  return tokens.tokens.nodes?.reduce((acc: any[], cv: any) => {
    acc.push(cv.token)

    return acc
  }, [])
}
