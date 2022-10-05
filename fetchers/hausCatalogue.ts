import useSWR from "swr"
import { ethers } from "ethers"
import { HausCatalogue__factory } from "../types/ethers-contracts"
import ZORA_ADDRESSES from "@zoralabs/v3/dist/addresses/5.json"
import { useLayoutStore } from "../stores/useLayoutStore"

export async function init() {
  const { signer, provider } = useLayoutStore()
  const hausCatalogueContract = HausCatalogue__factory.connect(
    process.env.HAUS_CATALOGUE_PROXY || "",
    // @ts-ignore
    signer ?? provider
  )

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
        ZORA_ADDRESSES.ERC721TransferHelper
      )
    },
    { revalidateOnFocus: true }
  )
}
