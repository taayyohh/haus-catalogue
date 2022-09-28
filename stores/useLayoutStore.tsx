import create from "zustand"
import { Signer } from "@ethersproject/abstract-signer"
import { Provider } from "@ethersproject/abstract-provider"
import { FetchSignerResult } from "@wagmi/core"

interface LayoutStoreProps {
  signer: Signer | null
  setSigner: (signer: FetchSignerResult | undefined) => void
  signerAddress: string | null
  setSignerAddress: (address: string) => void
  provider: Provider | undefined
  setProvider: (provider: Provider) => void
  setIsCatalogueArtist: (isCatalogueArtist: boolean | undefined) => void
  isCatalogueArtist: boolean | undefined
}

export const useLayoutStore = create<LayoutStoreProps>(set => ({
  isMobile: false,
  signer: null,
  setSigner: (signer: FetchSignerResult | undefined) => set({ signer }),
  signerAddress: null,
  setSignerAddress: (signerAddress: string) => set({ signerAddress }),
  provider: undefined,
  setProvider: (provider: Provider) => set({ provider }),
  setIsCatalogueArtist: (isCatalogueArtist: boolean | undefined) => set({ isCatalogueArtist }),
  isCatalogueArtist: undefined,
}))
