export const ipfsGateway = (uri: string): string => {
  return uri.replace('ipfs://', 'https://nftstorage.link/ipfs/')
}
