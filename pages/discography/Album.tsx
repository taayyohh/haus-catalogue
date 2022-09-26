import React from "react"
import { usePlayerStore } from "stores/usePlayerStore"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers } from "ethers"
import { fromSeconds, toSeconds } from "utils/helpers"
import AnimatedModal from "components/Modal/Modal"
import useHausCatalogue from "hooks/useHausCatalogue"
import dayjs from "dayjs"
import useZoraV3 from "hooks/useZoraV3"
import useSWR from "swr"
import { useAuctionInfo } from "hooks/useAuctionInfo"
import { useCountdown } from "../../hooks/useCountdown"
import Countdown from "./Countdown"

const Album: React.FC<any> = ({ release }) => {
  const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
  const { signer, signerAddress } = useLayoutStore()
  const [contract, setContract] = React.useState<any>()
  const { hausCatalogueContract, isOwner } = useHausCatalogue()
  const { zoraContracts, createAuction, cancelAuction, settleAuction } = useZoraV3()
  const { auctionInfo } = useAuctionInfo({ collectionAddress: release?.collectionAddress, tokenId: release?.tokenId })
  const { countdownString } = useCountdown(auctionInfo)

  /*
  
    handle create auction
  
   */
  const handleCreateAuction = React.useCallback(async () => {
    if (!createAuction) return

    await createAuction(
      release?.collectionAddress,
      Number(release?.tokenId),
      toSeconds({ days: 1 }),
      ethers.utils.parseEther(".05"),
      release.owner,
      Math.floor(Date.now() / 1000)
    )
  }, [createAuction, release])

  /*
  
    handle settle auction
  
   */
  const handleSettleAuction = React.useCallback(async () => {
    if (!createAuction) return

    await settleAuction(release?.collectionAddress, Number(release?.tokenId))
  }, [createAuction])

  /*

   handle settle auction

  */
  const handleCancelAuction = React.useCallback(async () => {
    if (!cancelAuction) return

    await settleAuction(release?.collectionAddress, Number(release?.tokenId))
  }, [cancelAuction])

  const handleCreateBid = React.useCallback(() => {
    if (!zoraContracts?.ReserveAuctionCoreEth || !release) return

    zoraContracts?.ReserveAuctionCoreEth.createBid(release?.collectionAddress, release?.tokenId, {
      value: ethers.utils.parseEther(".09"),
    })
  }, [zoraContracts?.ReserveAuctionCoreEth])

  const handleSetAuctionReservePrice = React.useCallback(() => {
    if (!zoraContracts?.ReserveAuctionCoreEth || !release) return

    zoraContracts?.ReserveAuctionCoreEth.setAuctionReservePrice(
      release?.collectionAddress,
      release?.tokenId,
      ethers.utils.parseEther(".01")
    )
  }, [zoraContracts?.ReserveAuctionCoreEth])

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
      <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
      <div className="flex w-full flex-col items-start py-2">
        <div className={"flex w-full flex-row items-start justify-between"}>
          <div className={"flex flex-col"}>
            <div className="text-xl font-bold">{release?.name}</div>
            <div>{release?.metadata?.artist}</div>
          </div>
          {auctionInfo && auctionInfo?.reservePrice > 0 && (
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

        {/*{console.log('is', isOwner)}*/}

        {/*<div onClick={() => handleSetAuctionReservePrice()}>update auction reserve price</div>*/}
        {/*<div onClick={() => handleCreateAuction()}>create auction</div>*/}
        {/*<div onClick={() => handleSettleAuction()}>settle auction</div>*/}
        {/*<div onClick={() => handleCancelAuction()}>cancel auction</div>*/}

        <Countdown countdownString={countdownString} />
      </div>
    </div>
  )
}

export default Album
