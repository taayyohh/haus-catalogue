import { HausCatalogue__factory } from "types/ethers-contracts/factories/HausCatalogue__factory"
import ZORA_ADDRESSES from "@zoralabs/v3/dist/addresses/5.json"
import { useSigner } from "wagmi"
import React from "react"
import useSWR from "swr"
import useZoraV3 from "./useZoraV3"
import { PromiseOrValue } from "@typechain/ethers-v5/static/common"
import { BigNumberish, BytesLike, ethers } from "ethers"
import { HausCatalogue } from "types/ethers-contracts"

const useHausCatalogue = () => {
  const { data: signer } = useSigner()
  const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL)
  const hausCatalogueContract =
    signer && HausCatalogue__factory.connect(process.env.HAUS_CATALOGUE_PROXY || "", signer ?? provider)
  const { ReserveAuctionCoreEth } = useZoraV3()

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
      await hausCatalogueContract?.royaltyPayoutAddress(_tokenId)
    },
    [hausCatalogueContract]
  )

  /*

   Royalty Payout Address

 */
  const royaltyInfo = React.useCallback(
    async (_tokenId: PromiseOrValue<BigNumberish>, _salePrice: PromiseOrValue<BigNumberish>) => {
      await hausCatalogueContract?.royaltyInfo(_tokenId, _salePrice)
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
  }, [ReserveAuctionCoreEth, hausCatalogueContract])

  return {
    hausCatalogueContract,
    mint,
    burn,
    owner,
    isApprovedForAll,
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
