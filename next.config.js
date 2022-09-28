/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NFT_STORAGE_TOKEN: process.env.NFT_STORAGE_TOKEN,
    MERKLE: process.env.MERKLE,
    HAUS_CATALOGUE_PROXY: process.env.HAUS_CATALOGUE_PROXY,
    ETH_RPC_URL: process.env.ETH_RPC_URL,
    INFURA_API_KEY: process.env.INFURA_API_KEY
  },
}

const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin")
const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withVanillaExtract(nextConfig)
