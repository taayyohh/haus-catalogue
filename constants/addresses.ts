export const HAUS_CATALOGUE_PROXY =
  {
    1: "0xbeff7dd438d3079f146b249552512baf7a1f8e75",
    5: "0x3da452152183140f1eb94b55a86f1671d51d63f4",
  }[process.env.NEXT_PUBLIC_CHAIN_ID || 1] || ""

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

export const RESERVE_AUCTION_CORE_ETH =
  {
    1: "0x5f7072E1fA7c01dfAc7Cf54289621AFAaD2184d0",
    5: "0x5f7072E1fA7c01dfAc7Cf54289621AFAaD2184d0",
  }[process.env.NEXT_PUBLIC_CHAIN_ID || 1] || ""
