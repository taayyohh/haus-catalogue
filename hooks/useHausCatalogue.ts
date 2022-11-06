import { HausCatalogue__factory } from "types/ethers-contracts/factories/HausCatalogue__factory"
import ZORA_ADDRESSES from "@zoralabs/v3/dist/addresses/5.json"
import React from "react"
import { PromiseOrValue } from "@typechain/ethers-v5/static/common"
import { BigNumberish, BytesLike, ethers, Signer } from "ethers"
import { HausCatalogue } from "types/ethers-contracts"
import { useLayoutStore } from "stores/useLayoutStore"
import useSWR from "swr"
import {HAUS_CATALOGUE_PROXY} from "constants/addresses";

const useHausCatalogue = () => {
  const { signer, provider } = useLayoutStore()
  const { data: ReserveAuctionCoreEth } = useSWR("ReserveAuctionCoreEth")

  const hausCatalogueContract = React.useMemo(() => {
    if (!provider) return

    return HausCatalogue__factory.connect(HAUS_CATALOGUE_PROXY as string, (signer as Signer) ?? provider)
  }, [provider])

  /*

     Mint

  */
  const mint = React.useCallback(
    async (
      _data: HausCatalogue.TokenDataStruct,
      _content: HausCatalogue.ContentDataStruct,
      _proof: PromiseOrValue<BytesLike>[]
    ) => {
      await hausCatalogueContract?.mint(_data, _content, _proof)

      hausCatalogueContract?.on("ContentUpdated", (_tokenId, _contentHash, _contentURI) => {
        return { _tokenId, _contentHash, _contentURI }
      })
    },
    [hausCatalogueContract]
  )

  /*

     Burn

  */
  const burn = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>) => {
      await hausCatalogueContract?.burn(_tokenId)
    },
    [hausCatalogueContract]
  )

  /*

    Update Content URI

   */
  const updateContentURI = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>, _content: HausCatalogue.ContentDataStruct) => {
      await hausCatalogueContract?.updateContentURI(_tokenId, _content)

      hausCatalogueContract?.on("ContentUpdated", (_tokenId, _contentHash, _contentURI) => {
        return { _tokenId, _contentHash, _contentURI }
      })
    },
    [hausCatalogueContract]
  )

  /*

        Update Creator

  */
  const updateCreator = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>, _creator: PromiseOrValue<string>) => {
      await hausCatalogueContract?.updateCreator(_tokenId, _creator)

      hausCatalogueContract?.on("CreatorUpdated", (_tokenId, _creator) => {
        return { _tokenId, _creator }
      })
    },
    [hausCatalogueContract]
  )

  /*

       Update Merkle Root

     */
  const updateRoot = React.useCallback(
    async (_newRoot: PromiseOrValue<BytesLike>) => {
      await hausCatalogueContract?.updateRoot(_newRoot)

      hausCatalogueContract?.on("MerkleRootUpdated", _newRoot => {
        return { _newRoot }
      })
    },
    [hausCatalogueContract]
  )

  /*

       Update Metadata

     */
  const updateMetadataURI = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>, _metadataURI: PromiseOrValue<string>) => {
      await hausCatalogueContract?.updateMetadataURI(_tokenId, _metadataURI)

      hausCatalogueContract?.on("MetadataUpdated", (_tokenId, _metadataURI) => {
        return { _tokenId, _metadataURI }
      })
    },
    [hausCatalogueContract]
  )

  /*

       Update Royalty Info

     */
  const updateRoyaltyInfo = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>, _royaltyPayoutAddress: PromiseOrValue<string>) => {
      await hausCatalogueContract?.updateMetadataURI(_tokenId, _royaltyPayoutAddress)

      hausCatalogueContract?.on("RoyaltyUpdated", (_tokenId, _royaltyPayoutAddress) => {
        return { _tokenId, _royaltyPayoutAddress }
      })
    },
    [hausCatalogueContract]
  )

  /*

      Creator

    */
  const creator = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>) => {
      await hausCatalogueContract?.creator(_tokenId)
    },
    [hausCatalogueContract]
  )

  /*

     Royalty Payout Address

   */
  const royaltyPayoutAddress = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>) => {
      return hausCatalogueContract?.royaltyPayoutAddress(_tokenId)
    },
    [hausCatalogueContract]
  )

  /*

    Royalty Payout Address

  */
  const royaltyInfo = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>, _salePrice: PromiseOrValue<BigNumberish>) => {
      return hausCatalogueContract?.royaltyInfo(_tokenId, _salePrice)
    },
    [hausCatalogueContract]
  )

  /*

         TokenURI

     */
  const tokenURI = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>) => {
      await hausCatalogueContract?.tokenURI(_tokenId)
    },
    [hausCatalogueContract]
  )

  const handleApprovalTransferHelper = React.useCallback(async () => {
    await hausCatalogueContract?.setApprovalForAll(ZORA_ADDRESSES.ERC721TransferHelper, true)
  }, [ReserveAuctionCoreEth, hausCatalogueContract])

  return {
    hausCatalogueContract,
    mint,
    burn,
    handleApprovalTransferHelper,
    updateContentURI,
    updateCreator,
    updateRoot,
    updateMetadataURI,
    updateRoyaltyInfo,
    creator,
    royaltyPayoutAddress,
    royaltyInfo,
    tokenURI,
  }
}

export default useHausCatalogue
