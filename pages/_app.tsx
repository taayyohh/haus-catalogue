import "styles/globals.css"
import type { AppProps } from "next/app"
import "@rainbow-me/rainbowkit/styles.css"
import { WagmiConfig } from "wagmi"
import { client } from "data/contract/client"
import { chains } from "data/contract/chains"
import Layout from "layouts/Layout"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { useIsMounted } from "hooks/useIsMounted"

function MyApp({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        {isMounted && (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
