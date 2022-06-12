import create from "zustand"
import {Signer} from "@ethersproject/abstract-signer";
import {Provider} from "@ethersproject/abstract-provider";

export const useLayoutStore = create(set => ({
    signer: null,
    setSigner: (signer: Signer) => set({ signer }),
    provider: null,
    setProvider: (provider: Provider) => set({ provider }),
}))
