import useSWR from "swr"
import { ethers } from "ethers"
import { fromSeconds } from "../utils/helpers"
import useZoraV3 from "./useZoraV3"
import { useLayoutStore } from "stores/useLayoutStore"

export function useAuctionInfo(token: any) {
  const { zoraContracts } = useZoraV3()
  const { signerAddress } = useLayoutStore()

  const { data: auctionInfo } = useSWR(
    `${token?.collectionAddress}+${token?.tokenId}`,
    async () => {
      const auction = await zoraContracts?.ReserveAuctionCoreEth.auctionForNFT(token?.collectionAddress, token?.tokenId)

      console.log('a', auction)
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
        notForAuction: parseInt(auction?.seller) === 0,
        auctionHasStarted: parseInt(auction?.firstBidTime) > 0,
        isSeller: ethers.utils.getAddress(auction?.seller) === signerAddress,
      }
    },
    { revalidateOnFocus: true }
  )

  return { auctionInfo }
}
