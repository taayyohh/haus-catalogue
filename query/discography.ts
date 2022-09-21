import { gql, request } from "graphql-request"

export const discographyQuery = async () => {
  const endpoint = "https://api.zora.co/graphql"

  const req = gql`
    query DiscographyQuery {
      collections(
        networks: { chain: GOERLI, network: ETHEREUM }
        where: { collectionAddresses: "0x3da452152183140F1EB94b55A86f1671d51d63F4" }
      ) {
        nodes {
          description
          name
          symbol
        }
      }
      tokens(
        where: { collectionAddresses: "0x3da452152183140F1EB94b55A86f1671d51d63F4" }
        networks: { chain: GOERLI, network: ETHEREUM }
      ) {
        nodes {
          token {
            collectionAddress
            collectionName
            owner
            tokenId
          }
        }
      }
    }
  `

  const data = await request(endpoint, req)
  console.log("d", data)
  return data
}
