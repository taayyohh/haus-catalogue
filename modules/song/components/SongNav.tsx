import React from "react"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import AnimatedModal from "components/Modal/Modal"
import CreateBid from "modules/auction/components/CreateBid"
import useSWR from "swr"
import { useRouter } from "next/router"
import { useCountdown } from "hooks/useCountdown"
import { useEnsData } from "hooks/useEnsData"
import { useContractRead } from "wagmi"
import ABI from "data/contract/abi/ReserveAuctionCoreETH.json"
import {ZERO_ADDRESS, ZORA_V3_ADDRESSES} from "constants/addresses"
import { AddressType } from "typings"
import dayjs from "dayjs"
import { ethers } from "ethers"

const SongNav: React.FC<{ artist: string; song: string }> = ({ artist, song }) => {
  const { data: release } = useSWR(`${artist}/${song}`)
  const router = useRouter()

  const { displayName, ensAvatar } = useEnsData(release?.owner as string)

  const { data: auction }: any = useContractRead({
    enabled: !!release?.tokenId && !!release?.collectionAddress,
    abi: ABI,
    address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
    functionName: "auctionForNFT",
    args: [release?.collectionAddress, release?.tokenId],
  })


  const { countdownString } = useCountdown(auction)
  const now = dayjs.unix(Date.now() / 1000)
  const end = dayjs.unix(parseInt(auction?.firstBidTime + auction?.duration) as number)
  const auctionHasEnded = end.diff(now, "second") < 0 && parseInt(auction?.firstBidTime) > 0
  const auctionHasStarted = parseInt(auction?.firstBidTime) > 0
  const notForAuction = auction?.seller === ZERO_ADDRESS

  return (
    <div className={`fixed relative top-16 flex hidden h-12 w-full items-center sm:flex`}>
      <button
        onClick={() => router.back()}
        className={"absolute left-7 rounded-full p-1 hover:bg-white"}
      >
        <ChevronLeftIcon width={"22px"} height={"22px"} className={"text-black"} />
      </button>
      {(!notForAuction && (
        <div className={"mx-auto flex w-4/5 items-center justify-between"}>
          {auctionHasStarted && !auctionHasEnded && (
            <div className={"flex items-center gap-3"}>
              <div className={"relative h-2 w-2 rounded-full"}>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-50"></span>
              </div>
              <div className={"text-sm text-emerald-600"}>
                <strong className={"pr-2"}>Live</strong> {countdownString}
              </div>
            </div>
          )}
          {auctionHasEnded && auctionHasStarted && <div>{countdownString}</div>}
          {!notForAuction && !auctionHasStarted && <div>Place a bid to kick off the auction!</div>}
          <div className={"flex items-center"}>
            {(auctionHasStarted && !auctionHasEnded && (
              <div className={"mr-4"}>
                <span className={"font-bold"}>Current Bid: </span>
                {ethers.utils.formatEther(auction?.highestBid.toString())} ETH
              </div>
            )) || (
              <div className={"mr-4"}>
                <span className={"font-bold"}>Reserve Price</span>:{" "}
                {ethers.utils.formatEther(auction?.reservePrice.toString())} ETH
              </div>
            )}
            {!notForAuction && !auctionHasEnded && (
              <AnimatedModal
                trigger={
                  <button className={"rounded bg-emerald-600 px-2 py-1 text-white hover:bg-emerald-500"}>
                    Place Bid
                  </button>
                }
                size={"auto"}
              >
                <CreateBid release={release} />
              </AnimatedModal>
            )}
          </div>
        </div>
      )) || (
        <div className={"mx-auto flex w-4/5 items-center"}>
          <div className={"flex items-center gap-3"}>
            <span className={"font-bold"}>collected by</span>
            <div className={"flex items-center gap-2"}>
              {ensAvatar && (
                <div className={"h-8 w-8 overflow-hidden rounded-full"}>
                  <img src={ensAvatar} />
                </div>
              )}

              {displayName}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SongNav
