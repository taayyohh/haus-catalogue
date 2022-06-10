import create from "zustand"
import {Signer} from "@ethersproject/abstract-signer";

export const useLayoutStore = create(set => ({
    signer: null,
    setSigner: (signer: Signer) => set({ signer }),
}))
