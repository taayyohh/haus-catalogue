import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { chains } from 'data/contract/chains'
import { client } from 'data/contract/client'
import { useIsMounted } from 'hooks/useIsMounted'
import Layout from 'layouts/Layout'
import type { AppProps } from 'next/app'
import 'styles/globals.css'
import { WagmiConfig } from 'wagmi'

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
