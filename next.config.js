/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NFT_STORAGE_TOKEN: process.env.NFT_STORAGE_TOKEN,
    MERKLE: process.env.MERKLE,
  },
}

const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin")
const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withVanillaExtract(nextConfig)
