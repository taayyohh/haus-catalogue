import create from "zustand"
import { Provider } from "@ethersproject/abstract-provider"
import { FetchSignerResult } from "@wagmi/core"

interface LayoutStoreProps {
  signer: FetchSignerResult
  setSigner: (signer: FetchSignerResult | undefined) => void
  signerAddress: string
  setSignerAddress: (address: string) => void
  provider: Provider | undefined
  setProvider: (provider: Provider) => void
}

export const useLayoutStore = create<LayoutStoreProps>(set => ({
  isMobile: false,
  signer: null,
  setSigner: (signer: FetchSignerResult | undefined) => set({ signer }),
  signerAddress: "",
  setSignerAddress: (signerAddress: string) => set({ signerAddress }),
  provider: undefined,
  setProvider: (provider: Provider) => set({ provider }),
}))
