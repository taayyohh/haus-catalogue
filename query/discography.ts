import { gql, request } from "graphql-request"

export const discographyQuery = async () => {
  const endpoint = "https://api.zora.co/graphql"

  const req = gql`
    query DiscographyQuery {
      tokens(
        networks: { chain: GOERLI, network: ETHEREUM }
        where: { collectionAddresses: "0x3da452152183140f1eb94b55a86f1671d51d63f4" }
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

  const tokens = await request(endpoint, req)
  return tokens.tokens.nodes?.reduce((acc: any[], cv: any) => {
    acc.push(cv.token)

    return acc
  }, [])
}
