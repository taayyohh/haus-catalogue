export const CHAIN =
  {
    1: "MAINNET",
    5: "GOERLI",
  }[process.env.NEXT_PUBLIC_CHAIN_ID || 1] || ""
