import React from "react"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import AnimatedModal from "../Modal/Modal"
import CreateBid from "../Album/CreateBid"
import useSWR from "swr"
import { useRouter } from "next/router"
import { useAuction } from "hooks/useAuction"
import { useCountdown } from "hooks/useCountdown"
import { useEnsAvatar, useEnsName } from "wagmi"
import { ethers } from "ethers"
import { useEnsData } from "../../hooks/useEnsData"

const SongNav: React.FC<{ artist: string; song: string }> = ({ artist, song }) => {
  const { data: release } = useSWR(`${artist}/${song}`)
  const router = useRouter()
  const { auction } = useAuction(release)
  const { countdownString } = useCountdown(auction)

  const { displayName, ensAvatar } = useEnsData(release?.owner as string)

  return (
    <div className={`fixed relative top-16 flex hidden h-12 w-full items-center border-y sm:flex`}>
      <button onClick={() => router.back()} className={"absolute"}>
        <ChevronLeftIcon width={"28px"} height={"28px"} className={"ml-7 text-black"} />
      </button>
      {(!auction?.notForAuction && (
        <div className={"mx-auto flex w-4/5 items-center justify-between"}>
          {auction?.auctionHasStarted && !auction?.auctionHasEnded && (
            <div className={"flex items-center gap-3"}>
              <div className={"relative h-2 w-2 rounded-full"}>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-50"></span>
              </div>
              <div className={"text-sm text-emerald-600"}>
                <strong className={"pr-2"}>Live</strong> {countdownString}
              </div>
            </div>
          )}
          {auction?.auctionHasEnded && auction?.auctionHasStarted && <div>{countdownString}</div>}
          {!auction?.notForAuction && !auction?.auctionHasStarted && <div>Place a bid to kick off the auction!</div>}
          <div className={"flex items-center"}>
            {(auction?.auctionHasStarted && !auction?.auctionHasEnded && (
              <div className={"mr-4"}>
                <span className={"font-bold"}>Current Bid: </span>
                {auction?.highestBid} ETH
              </div>
            )) || (
              <div className={"mr-4"}>
                <span className={"font-bold"}>Reserve Price</span>: {auction?.reservePrice} ETH
              </div>
            )}
            {!auction?.notForAuction && !auction?.auctionHasEnded && (
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
        <div className={"mx-auto flex w-4/5 items-center justify-between"}>
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
