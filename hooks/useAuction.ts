import ReserveAuctionCoreEth from "@zoralabs/v3/dist/artifacts/ReserveAuctionCoreEth.sol/ReserveAuctionCoreEth.json"
import useSWR from "swr"
import { ethers, Signer } from "ethers"
import { fromSeconds } from "utils/helpers"
import { useLayoutStore } from "stores/useLayoutStore"
import dayjs from "dayjs"
import ZORA_ADDRESSES_GOERLI from "@zoralabs/v3/dist/addresses/5.json"
import ZORA_ADDRESSES_MAINNET from "@zoralabs/v3/dist/addresses/1.json"
import { CHAIN } from "../constants/network"

export function useAuction(release: any) {
  const { signerAddress, provider } = useLayoutStore()
  const { data: ReserveAuctionCoreEthWrite } = useSWR("ReserveAuctionCoreEth")

  const { data: auction } = useSWR(
    `${release?.collectionAddress}+${release?.tokenId}`,
    async () => {
      let ReserveAuctionCoreEthRead
      if (!ReserveAuctionCoreEthWrite) {
        ReserveAuctionCoreEthRead = new ethers.Contract(
          CHAIN === "MAINNET"
            ? ZORA_ADDRESSES_MAINNET.ReserveAuctionCoreEth
            : ZORA_ADDRESSES_GOERLI.ReserveAuctionCoreEth,
          ReserveAuctionCoreEth.abi,
          provider
        )
      }

      const auction = await (ReserveAuctionCoreEthWrite || ReserveAuctionCoreEthRead).auctionForNFT(
        release?.collectionAddress,
        release?.tokenId
      )

      const now = dayjs.unix(Date.now() / 1000)
      const end = dayjs.unix(parseInt(auction?.firstBidTime + auction?.duration) as number)

      return {
        reservePrice: parseFloat(ethers.utils.formatEther(auction?.reservePrice)),
        minBid:
          parseFloat(ethers.utils.formatEther(auction?.highestBid)) +
            parseFloat(ethers.utils.formatEther(auction?.highestBid)) * 0.1 ||
          parseFloat(ethers.utils.formatEther(auction?.reservePrice)),
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
        auctionHasEnded: end.diff(now, "second") < 0 && parseInt(auction?.firstBidTime) > 0,
        isSeller: ethers.utils.getAddress(auction?.seller) === signerAddress,
        isWinner:
          end.diff(now, "second") < 0 &&
          parseInt(auction?.firstBidTime) > 0 &&
          ethers.utils.getAddress(auction?.highestBidder) === signerAddress,
      }
    },
    { revalidateOnFocus: true }
  )

  return { auction }
}
