import useSWR from "swr"
import { ethers } from "ethers"
import { HAUS_CATALOGUE_PROXY } from "constants/addresses"
import { useContract, useSigner } from "wagmi"
import ABI from "data/contract/abi/HausCatalogueABI.json"

export async function init() {
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
}
