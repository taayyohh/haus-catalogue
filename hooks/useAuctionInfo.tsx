import useSWR from "swr"
import { ethers } from "ethers"
import { fromSeconds } from "../utils/helpers"
import useZoraV3 from "./useZoraV3"

export function useAuctionInfo(token: { collectionAddress: string; tokenId: string }) {
  const { zoraContracts } = useZoraV3()

  const { data: auctionInfo } = useSWR(
    `${token?.collectionAddress}+${token?.tokenId}`,
    async () => {
      const auction = await zoraContracts?.ReserveAuctionCoreEth.auctionForNFT(token?.collectionAddress, token?.tokenId)

      return {
        reservePrice: parseFloat(ethers.utils.formatEther(auction?.reservePrice)),
        highestBid: parseFloat(ethers.utils.formatEther(auction?.highestBid)),
        highestBidder: ethers.utils.getAddress(auction?.highestBidder),
        duration: {
          seconds: parseInt(auction?.duration),
          time: fromSeconds(auction?.duration),
        },
        sellerFundsRecipient: ethers.utils.getAddress(auction?.sellerFundsRecipient),
        seller: ethers.utils.getAddress(auction?.seller),
        firstBidTime: parseInt(auction?.firstBidTime),
        startTime: parseInt(auction?.startTime),
        endTime: parseInt(auction?.firstBidTime + auction?.duration),
      }
    },
    { revalidateOnFocus: true }
  )

  return { auctionInfo }
}
