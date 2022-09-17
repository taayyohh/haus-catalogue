import create from "zustand"
import { Signer } from "@ethersproject/abstract-signer"
import { Provider } from "@ethersproject/abstract-provider"

interface LayoutStoreProps {
  signer: Signer | null
  setSigner: (signer: Signer) => void
  signerAddress: string | null
  setSignerAddress: (address: string) => void
  provider: Provider | null
  setProvider: (provider: Provider) => void
}

export const useLayoutStore = create<LayoutStoreProps>(set => ({
  isMobile: false,
  signer: null,
  setSigner: (signer: Signer) => set({ signer }),
  signerAddress: null,
  setSignerAddress: (signerAddress: string) => set({ signerAddress }),
  provider: null,
  setProvider: (provider: Provider) => set({ provider }),
}))
