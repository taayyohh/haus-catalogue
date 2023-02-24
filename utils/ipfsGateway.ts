export const ipfsGateway = (uri: string) => {
  return uri.replace("ipfs://", "https://ipfs.zora.co/ipfs/")
}
