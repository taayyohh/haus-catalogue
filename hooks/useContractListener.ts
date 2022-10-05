import { mutate } from "swr"
import useHausCatalogue from "./useHausCatalogue"
import useZoraV3 from "./useZoraV3"
import {useLayoutStore} from "../stores/useLayoutStore";
import {HausCatalogue__factory} from "../types/ethers-contracts";

export function useContractListener() {
  const { signer, provider, signerAddress } = useLayoutStore()

  const hausCatalogueContract = HausCatalogue__factory.connect(
      process.env.HAUS_CATALOGUE_PROXY || "",
      // @ts-ignore
      signer ?? provider
  )
  const { zoraContracts } = useZoraV3()

  hausCatalogueContract?.on("CreatorUpdated", (tokenId, creator) => {
    // mutate(['state-', proposalId])
  })

  hausCatalogueContract?.on("ContentUpdated", (tokenId, contentHash, contentURI) => {
    // mutate(['state-', proposalId])
  })

  hausCatalogueContract?.on("MetadataUpdated", (tokenId, metadataURI) => {
    // mutate(['state-', proposalId])
  })

  hausCatalogueContract?.on("MerkleRootUpdated", merkleRoot => {
    // mutate(['state-', proposalId])
  })

  hausCatalogueContract?.on("RoyaltyUpdated", (tokenId, payoutAddress) => {
    // mutate(['state-', proposalId])
  })

  zoraContracts.ReserveAuctionCoreEth.on("AuctionCreated", (tokenContract: any, tokenId: any, auction: any) => {
    console.log("t", tokenContract, tokenId, auction)
  })

  zoraContracts.ReserveAuctionCoreEth.on(
    "AuctionReservePriceUpdated",
    (tokenContract: any, tokenId: any, auction: any) => {
      console.log("t", tokenContract, tokenId, auction)
    }
  )

  zoraContracts.ReserveAuctionCoreEth.on("AuctionCanceled", (tokenContract: any, tokenId: any, auction: any) => {
    console.log("t", tokenContract, tokenId, auction)
  })

  zoraContracts.ReserveAuctionCoreEth.on(
    "AuctionBid",
    (tokenContract: any, tokenId: any, firstBid: any, auction: any) => {
      console.log("t", tokenContract, tokenId, firstBid, auction)
    }
  )

  zoraContracts.ReserveAuctionCoreEth.on("AuctionEnded", (tokenContract: any, tokenId: any, auction: any) => {
    console.log("t", tokenContract, tokenId, auction)
  })
}
