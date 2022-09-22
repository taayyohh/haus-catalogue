import { HausCatalogue__factory } from "types/ethers-contracts/factories/HausCatalogue__factory"
import ZORA_ADDRESSES from "@zoralabs/v3/dist/addresses/5.json"
import ReserveAuctionABI from "@zoralabs/v3/dist/artifacts/ReserveAuctionCoreEth.sol/ReserveAuctionCoreEth.json"
import ZoraModuleManagerABI from "@zoralabs/v3/dist/artifacts/ZoraModuleManager.sol/ZoraModuleManager.json"
import AsksV1_1ABI from "@zoralabs/v3/dist/artifacts/AsksV1_1.sol/AsksV1_1.json"
import ERC721TransferHelperABI from "@zoralabs/v3/dist/artifacts/ERC721TransferHelper.sol/ERC721TransferHelper.json"
import { useSigner } from "wagmi"
import React from "react"
import useSWR from "swr"
import { BigNumberish, ethers } from "ethers"
import { PromiseOrValue } from "@typechain/ethers-v5/static/common"

const useContracts = () => {
  const { data: signer } = useSigner()
  const hausCatalogueContract = signer && HausCatalogue__factory.connect(process.env.HAUS_CATALOGUE_PROXY || "", signer)
  const [zoraContracts, setZoraContracts] = React.useState<any>()
  React.useMemo(() => {
    if (!signer) return

    setZoraContracts({
      ReserveAuctionCoreEth: new ethers.Contract(ZORA_ADDRESSES.ReserveAuctionCoreEth, ReserveAuctionABI.abi, signer),
      AsksV1_1: new ethers.Contract(ZORA_ADDRESSES.AsksV1_1, AsksV1_1ABI.abi, signer),
      ZoraModuleManager: new ethers.Contract(ZORA_ADDRESSES.ZoraModuleManager, ZoraModuleManagerABI.abi, signer),
      ERC721TransferHelper: new ethers.Contract(
        ZORA_ADDRESSES.ERC721TransferHelper,
        ERC721TransferHelperABI.abi,
        signer
      ),
    })
  }, [
    signer,
    ZORA_ADDRESSES.ReserveAuctionCoreEth,
    ZORA_ADDRESSES.ZoraModuleManager,
    ZORA_ADDRESSES.AsksV1_1,
    ZORA_ADDRESSES.ERC721TransferHelper,
  ])

  /*

    owner

   */
  const { data: owner } = useSWR(
    hausCatalogueContract ? `haus-catalogue-contract` : null,
    async () => {
      return hausCatalogueContract?.owner()
    },
    { revalidateOnFocus: false }
  )

  /*

    Create Auction

   */
  const createAuction = React.useCallback(
    async (
      _tokenContract: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _duration: PromiseOrValue<BigNumberish>,
      _reservePrice: PromiseOrValue<BigNumberish>,
      _sellerFundsRecipient: PromiseOrValue<string>,
      _startTime: PromiseOrValue<BigNumberish>
    ) => {
      await zoraContracts?.ReserveAuctionCoreEth?.createAuction(
        _tokenContract,
        _tokenId,
        _duration,
        _reservePrice,
        _sellerFundsRecipient,
        _startTime
      )
    },
    [zoraContracts?.ReserveAuctionCoreEth]
  )

  /*

    Settle Auction

   */
  const settleAuction = React.useCallback(
    async (_tokenContract: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>) => {
      await zoraContracts?.ReserveAuctionCoreEth.settleAuction(_tokenContract, _tokenId)
    },
    [zoraContracts?.ReserveAuctionCoreEth]
  )

  /*

      isApprovedForAll

   */
  const { data: isApprovedForAll } = useSWR(
    hausCatalogueContract ? `has-approved-zora-transfer-helper` : null,
    async () => {
      return hausCatalogueContract?.isApprovedForAll(
        // @ts-ignore
        signer._address, // NFT owner address
        ZORA_ADDRESSES.ERC721TransferHelper
      )
    },
    { revalidateOnFocus: true }
  )

  const handleApprovalTransferHelper = React.useCallback(async () => {
    await hausCatalogueContract?.setApprovalForAll(ZORA_ADDRESSES.ERC721TransferHelper, true)
  }, [zoraContracts?.ReserveAuctionCoreEth, hausCatalogueContract])

  /*

      isModuleApproved

   */
  const { data: isModuleApproved } = useSWR(
    zoraContracts?.ZoraModuleManager ? `has-approved-zora-module-manager` : null,
    async () => {
      return zoraContracts?.ZoraModuleManager?.isModuleApproved(
        // @ts-ignore
        signer._address, // NFT owner address
        ZORA_ADDRESSES.ReserveAuctionCoreEth
      )
    },
    { revalidateOnFocus: true }
  )

  const handleApprovalManager = React.useCallback(async () => {
    await zoraContracts?.ZoraModuleManager.setApprovalForModule(ZORA_ADDRESSES.ReserveAuctionCoreEth, true)
  }, [zoraContracts?.ZoraModuleManager])

  return {
    hausCatalogueContract,
    zoraContracts,
    owner,
    isApprovedForAll,
    handleApprovalTransferHelper,
    isModuleApproved,
    handleApprovalManager,
    createAuction,
    settleAuction,
  }
}

export default useContracts
