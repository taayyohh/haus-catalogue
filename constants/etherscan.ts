export const ETHERSCAN_BASE_URL =
    {
        1: 'https://etherscan.io',
        5: 'https://goerli.etherscan.io',
    }[process.env.NEXT_PUBLIC_CHAIN_ID || 1] || ''
