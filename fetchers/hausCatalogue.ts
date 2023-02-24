import useSWR from "swr"
import { ethers } from "ethers"
import { HausCatalogue__factory } from "../types/ethers-contracts"
import ZORA_ADDRESSES_GOERLI from "@zoralabs/v3/dist/addresses/5.json"
import ZORA_ADDRESSES_MAINNET from "@zoralabs/v3/dist/addresses/1.json"
import { useLayoutStore } from "../stores/useLayoutStore"
import { FetchSignerResult, Provider, Signer } from "@wagmi/core"
import { HAUS_CATALOGUE_PROXY } from "constants/addresses"
import { CHAIN } from "../constants/network"
import {useContract, useProvider, useSigner} from "wagmi"
import ABI from 'data/contract/abi/HausCatalogueABI.json'

export async function init() {
  const provider = useProvider()
  const signer = useSigner()
    const hausCatalogueContract = useContract({
        address: HAUS_CATALOGUE_PROXY,
        abi: ABI,
    })


  /*

 merkleRoot

 */
  useSWR(
    hausCatalogueContract ? `merkleRoot` : null,
    async () => {
      return await hausCatalogueContract?.merkleRoot()
    },
    { revalidateOnFocus: false }
  )

  /*
    
      owner
    
     */
  useSWR(
    hausCatalogueContract ? `owner` : null,
    async () => {
      return hausCatalogueContract?.owner()
    },
    { revalidateOnFocus: false }
  )

  // const { data: ownerOf } = useSWR(
  //     release?.tokenId && hausCatalogueContract ? ["ownerOf", release?.tokenId] : null,
  //     async () => await hausCatalogueContract?.ownerOf(release?.tokenId as string),
  //     { revalidateOnFocus: false }
  // )

  /*

        isOwner

       */
  useSWR(
    hausCatalogueContract ? `isOwner` : null,
    async () => {
      //@ts-ignore
      return ethers.utils.getAddress(await hausCatalogueContract?.owner()) === ethers.utils.getAddress(signer?._address)
    },
    { revalidateOnFocus: false }
  )

  /*
    
         isApprovedForAll
    
      */
  useSWR(
    hausCatalogueContract ? `isApprovedForAll` : null,
    async () => {
      return hausCatalogueContract?.isApprovedForAll(
        // @ts-ignore
        signer._address, // NFT owner address
        CHAIN === "MAINNET" ? ZORA_ADDRESSES_MAINNET.ERC721TransferHelper : ZORA_ADDRESSES_GOERLI.ERC721TransferHelper
      )
    },
    { revalidateOnFocus: true }
  )
}
