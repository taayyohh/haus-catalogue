export const ALCHEMY_RPC_URL = {
  1: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  5: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
}[process.env.NEXT_PUBLIC_CHAIN_ID || 1]

export const INFURA_RPC_URL = {
  1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
  5: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
}[process.env.NEXT_PUBLIC_CHAIN_ID || 1]
