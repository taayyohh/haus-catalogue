import "styles/globals.css"
import type { AppProps } from "next/app"
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { configureChains, createClient, WagmiConfig, defaultChains } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import Layout from "components/Layout/Layout"

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [
      defaultChains.find(
        chain => chain.id.toString() === "5" //process.env.NEXT_PUBLIC_CHAIN_ID
      )!,
    ],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID })]
  )


  const { connectors } = getDefaultWallets({
    appName: "Haus Catalogue",
    chains,
  })

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
