import React from "react"
import { usePlayerStore } from "stores/usePlayerStore"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers } from "ethers"
import { fromSeconds, toSeconds } from "utils/helpers"
import AnimatedModal from "components/Modal/Modal"
import useHausCatalogue from "hooks/useHausCatalogue"
import dayjs from "dayjs"
import useZoraV3 from "hooks/useZoraV3"

const Album: React.FC<any> = ({ release, token }) => {
  const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
  const { signer, signerAddress } = useLayoutStore()
  const [contract, setContract] = React.useState<any>()
  const { hausCatalogueContract } = useHausCatalogue()
  const { zoraContracts, createAuction, cancelAuction, settleAuction } = useZoraV3()

  /*
  
    handle create auction
  
   */
  const handleCreateAuction = React.useCallback(async () => {
    if (!createAuction) return

    await createAuction(
      token?.collectionAddress,
      Number(token.tokenId),
      toSeconds({ days: 1 }),
      ethers.utils.parseEther(".05"),
      token.owner,
      Math.floor(Date.now() / 1000)
    )
  }, [createAuction, token, release])

  /*
  
    handle settle auction
  
   */
  const handleSettleAuction = React.useCallback(async () => {
    if (!createAuction) return

    await settleAuction(token?.collectionAddress, Number(token.tokenId))
  }, [createAuction, token])

  /*

   handle settle auction

  */
  const handleCancelAuction = React.useCallback(async () => {
    if (!cancelAuction) return

    await settleAuction(token?.collectionAddress, Number(token.tokenId))
  }, [cancelAuction, token])

  const [auctionInfo, setAuctionInfo] = React.useState<any>()
  React.useMemo(async () => {
    if (!zoraContracts?.ReserveAuctionCoreEth) return

    const auction = await zoraContracts?.ReserveAuctionCoreEth.auctionForNFT(token.collectionAddress, token.tokenId)

    setAuctionInfo({
      reservePrice: ethers.utils.formatEther(auction?.reservePrice),
      highestBid: ethers.utils.formatEther(auction?.highestBid),
      highestBidder: ethers.utils.getAddress(auction?.highestBidder),
      duration: {
        seconds: auction?.duration,
        time: fromSeconds(auction?.duration),
      },
      sellerFundsRecipient: auction?.sellerFundsRecipient,
      seller: auction?.seller,
      firstBidTime: auction?.firstBidTime,
      startTime: auction?.startTime,
      endTime: auction?.firstBidTime + auction?.duration,
    })
  }, [zoraContracts?.ReserveAuctionCoreEth, token])

  const handleCreateBid = React.useCallback(() => {
    if (!zoraContracts?.ReserveAuctionCoreEth || !token) return

    zoraContracts?.ReserveAuctionCoreEth.createBid(token.collectionAddress, token.tokenId, {
      value: ethers.utils.parseEther(".08"),
    })
  }, [zoraContracts?.ReserveAuctionCoreEth, token])

  const handleSetAuctionReservePrice = React.useCallback(() => {
    if (!zoraContracts?.ReserveAuctionCoreEth || !token) return

    zoraContracts?.ReserveAuctionCoreEth.setAuctionReservePrice(
      token.collectionAddress,
      token.tokenId,
      ethers.utils.parseEther(".01")
    )
  }, [zoraContracts?.ReserveAuctionCoreEth, token])

  const [countDownString, setCountdownString] = React.useState("")
  React.useEffect(() => {
    if (!auctionInfo) return

    // console.log('aaaa', auctionInfo?.seller === 0)

    const endAuction = (interval: NodeJS.Timer) => {
      clearInterval(interval)
      setCountdownString("0h 0m 0s")
      // setAuctionCompleted(true)
    }

    const interval = setInterval(() => {
      const now = dayjs.unix(Date.now() / 1000)
      const end = dayjs.unix(auctionInfo?.endTime as number)
      let countdown = end.diff(now, "second")

      countdown > 0 ? countdown-- : endAuction(interval)
      const countdownString = `${Math.floor(countdown / 3600)}h ${Math.floor((countdown % 3600) / 60)}m ${
        countdown % 60
      }s`
      setCountdownString(countdownString)
    }, 1000)
    // return () => {
    //   clearInterval(interval)
    // }
  }, [auctionInfo])

  return (
    <div
      key={release?.image}
      className="flex w-full flex-col items-center"
      // onClick={() =>
      //   addToQueue([
      //     ...queuedMusic,
      //     {
      //       artist: release?.artist,
      //       image: release?.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/"),
      //       songs: [
      //         {
      //           audio: [release?.losslessAudio.replace("ipfs://", "https://ipfs.io/ipfs/")],
      //           title: release?.title,
      //           trackNumber: release?.trackNumber,
      //         },
      //       ],
      //     },
      //   ])
      // }
    >
      <img src={release?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
      <div className="flex w-full flex-col items-start py-2">
        <div className={"flex w-full flex-row items-start justify-between"}>
          <div className={"flex flex-col"}>
            <div className="text-xl font-bold">{release?.name}</div>
            <div>{release?.artist}</div>
          </div>
          {auctionInfo?.reservePrice > 0 && (
            <AnimatedModal
              trigger={
                <div
                  className={
                    "relative flex cursor-pointer items-center gap-1 rounded-2xl bg-rose-300 px-3 py-1 text-sm hover:bg-rose-700 hover:text-white"
                  }
                >
                  <span className={"text-xs"}>Bid:</span> {auctionInfo?.reservePrice}
                  <span>ETH</span>
                </div>
              }
            >
              <div onClick={() => handleCreateBid()}>create bid</div>
            </AnimatedModal>
          )}
        </div>

        {/*<div onClick={() => handleSetAuctionReservePrice()}>update auction reserve price</div>*/}
        {/*<div onClick={() => handleCreateAuction()}>create auction</div>*/}
        {/*<div onClick={() => handleSettleAuction()}>settle auction</div>*/}
        {/*<div onClick={() => handleCancelAuction()}>cancel auction</div>*/}

        <div className={"relative flex items-center gap-3 py-1 text-sm"}>
          <div className={"relative h-2 w-2 rounded-full"}>
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-rose-800 opacity-75"></span>
          </div>

          {countDownString}
        </div>
      </div>
    </div>
  )
}

export default Album
