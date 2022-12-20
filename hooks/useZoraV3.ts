import ZORA_ADDRESSES_GOERLI from "@zoralabs/v3/dist/addresses/5.json"
import ZORA_ADDRESSES_MAINNET from "@zoralabs/v3/dist/addresses/1.json"

import React from "react"
import useSWR from "swr"
import { BigNumberish, ContractTransaction, ethers, Signer } from "ethers"
import { PromiseOrValue } from "@typechain/ethers-v5/static/common"
import { useLayoutStore } from "stores/useLayoutStore"
import { CHAIN } from "../constants/network"

const useZoraV3 = () => {
  const { signer } = useLayoutStore()
  const { data: ZoraModuleManager } = useSWR("ZoraModuleManager")
  const { data: ReserveAuctionCoreEth } = useSWR("ReserveAuctionCoreEth")

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
    ): Promise<ContractTransaction> => {
      return ReserveAuctionCoreEth?.createAuction(
        _tokenContract,
        _tokenId,
        _duration,
        _reservePrice,
        _sellerFundsRecipient,
        _startTime
      )
    },
    [ReserveAuctionCoreEth]
  )

  /*

      Settle Auction

     */
  const settleAuction = React.useCallback(
    async (
      _tokenContract: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>
    ): Promise<ContractTransaction> => {
      return await ReserveAuctionCoreEth.settleAuction(_tokenContract, _tokenId)
    },
    [ReserveAuctionCoreEth]
  )

  /*

    Cancel Auction

   */
  const cancelAuction = React.useCallback(
    async (_tokenContract: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>) => {
      await ReserveAuctionCoreEth.cancelAuction(_tokenContract, _tokenId)
    },
    [ReserveAuctionCoreEth]
  )

  /*

    Create Bid

   */

  const createBid = React.useCallback(
    async (_tokenContract: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _value: any) => {
      await ReserveAuctionCoreEth.createBid(_tokenContract, _tokenId, {
        value: ethers.utils.parseEther(_value.toString()),
      })
    },
    [ReserveAuctionCoreEth]
  )

  /*

        isModuleApproved

     */
  const { data: isModuleApproved } = useSWR(
    ZoraModuleManager ? `has-approved-zora-module-manager` : null,
    async () => {
      return ZoraModuleManager?.isModuleApproved(
        // @ts-ignore
        signer._address, // NFT owner address
        CHAIN === "MAINNET" ? ZORA_ADDRESSES_MAINNET.ReserveAuctionCoreEth : ZORA_ADDRESSES_GOERLI.ReserveAuctionCoreEth
      )
    },
    { revalidateOnFocus: true }
  )

  const handleApprovalManager = React.useCallback(async () => {
    const address =
      CHAIN === "MAINNET" ? ZORA_ADDRESSES_MAINNET.ReserveAuctionCoreEth : ZORA_ADDRESSES_GOERLI.ReserveAuctionCoreEth
    await ZoraModuleManager.setApprovalForModule(address, true)
  }, [ZoraModuleManager])

  return {
    isModuleApproved,
    handleApprovalManager,
    createAuction,
    settleAuction,
    cancelAuction,
    createBid,
  }
}

export default useZoraV3
