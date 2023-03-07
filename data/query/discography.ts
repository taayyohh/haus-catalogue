import { gql, request } from "graphql-request"
import { HAUS_CATALOGUE_PROXY } from "constants/addresses"
import { CHAIN } from "constants/network"
import { ZORA_API } from "constants/api"
import { ReleaseProps } from "./typings"

export const discographyQuery = async () => {
  const req = gql`
    query DiscographyQuery($address: [String!], $chain: Chain!) {
      tokens(
        networks: { chain: $chain, network: ETHEREUM }
        where: { collectionAddresses: $address }
        pagination: { limit: 50 }
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
          }
        }
      }
    }
  `
  const variables = {
    address: HAUS_CATALOGUE_PROXY,
    chain: CHAIN,
  }

  const data: { tokens: { nodes: [] } } = await request(ZORA_API, req, variables)
  const discography = data.tokens.nodes.map(({ token }: { token: ReleaseProps }) => token)
  return discography as ReleaseProps[]
}
