import ReserveAuctionCoreEth from "@zoralabs/v3/dist/artifacts/ReserveAuctionCoreEth.sol/ReserveAuctionCoreEth.json"
import ZoraModuleManager from "@zoralabs/v3/dist/artifacts/ZoraModuleManager.sol/ZoraModuleManager.json"
import AsksV1_1ABI from "@zoralabs/v3/dist/artifacts/AsksV1_1.sol/AsksV1_1.json"
import ERC721TransferHelperABI from "@zoralabs/v3/dist/artifacts/ERC721TransferHelper.sol/ERC721TransferHelper.json"
import { useLayoutStore } from "stores/useLayoutStore"
import useSWR from "swr"
import { ethers, Signer } from "ethers"
import ZORA_ADDRESSES from "@zoralabs/v3/dist/addresses/5.json"

export async function initZoraV3() {
  const { signer, provider } = useLayoutStore()

  useSWR(signer ? "ReserveAuctionCoreEth" : null, () => {
    return new ethers.Contract(ZORA_ADDRESSES.ReserveAuctionCoreEth, ReserveAuctionCoreEth.abi, signer as Signer)
  })

  useSWR(signer ? "AsksV1_1" : null, () => {
    return new ethers.Contract(ZORA_ADDRESSES.AsksV1_1, AsksV1_1ABI.abi, (signer as Signer) ?? provider)
  })

  useSWR(signer ? "ZoraModuleManager" : null, () => {
    return new ethers.Contract(ZORA_ADDRESSES.ZoraModuleManager, ZoraModuleManager.abi, (signer as Signer) ?? provider)
  })

  useSWR(signer ? "ERC721TransferHelper" : null, () => {
    return new ethers.Contract(
      ZORA_ADDRESSES.ERC721TransferHelper,
      ERC721TransferHelperABI.abi,
      (signer as Signer) ?? provider
    )
  })
}
