import ReserveAuctionCoreEth from "@zoralabs/v3/dist/artifacts/ReserveAuctionCoreEth.sol/ReserveAuctionCoreEth.json"
import ZoraModuleManager from "@zoralabs/v3/dist/artifacts/ZoraModuleManager.sol/ZoraModuleManager.json"
import AsksV1_1ABI from "@zoralabs/v3/dist/artifacts/AsksV1_1.sol/AsksV1_1.json"
import ERC721TransferHelperABI from "@zoralabs/v3/dist/artifacts/ERC721TransferHelper.sol/ERC721TransferHelper.json"
import useSWR from "swr"
import { ethers, Signer } from "ethers"
import ZORA_ADDRESSES_GOERLI from "@zoralabs/v3/dist/addresses/5.json"
import ZORA_ADDRESSES_MAINNET from "@zoralabs/v3/dist/addresses/1.json"
import { CHAIN } from "../constants/network"
import { useProvider, useSigner } from "wagmi"

export async function initZoraV3() {
  const { data: signer } = useSigner()
  const provider = useProvider()

  useSWR(signer ? "ReserveAuctionCoreEth" : null, () => {
    return new ethers.Contract(
      CHAIN === "MAINNET" ? ZORA_ADDRESSES_MAINNET.ReserveAuctionCoreEth : ZORA_ADDRESSES_GOERLI.ReserveAuctionCoreEth,
      ReserveAuctionCoreEth.abi,
      signer as Signer
    )
  })

  useSWR(signer ? "AsksV1_1" : null, () => {
    return new ethers.Contract(
      CHAIN === "MAINNET" ? ZORA_ADDRESSES_MAINNET.AsksV1_1 : ZORA_ADDRESSES_GOERLI.AsksV1_1,
      AsksV1_1ABI.abi,
      (signer as Signer) ?? provider
    )
  })

  useSWR(signer ? "ZoraModuleManager" : null, () => {
    return new ethers.Contract(
      CHAIN === "MAINNET" ? ZORA_ADDRESSES_MAINNET.ZoraModuleManager : ZORA_ADDRESSES_GOERLI.ZoraModuleManager,
      ZoraModuleManager.abi,
      (signer as Signer) ?? provider
    )
  })

  useSWR(signer ? "ERC721TransferHelper" : null, () => {
    return new ethers.Contract(
      CHAIN === "MAINNET" ? ZORA_ADDRESSES_MAINNET.ERC721TransferHelper : ZORA_ADDRESSES_GOERLI.ERC721TransferHelper,
      ERC721TransferHelperABI.abi,
      (signer as Signer) ?? provider
    )
  })
}
