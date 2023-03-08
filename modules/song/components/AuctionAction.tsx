import AnimatedModal from "components/Modal/Modal"
import CreateBid from "modules/auction/components/CreateBid"
import SettleAuction from "modules/auction/components/SettleAuction"
import React from "react"
import { ReleaseProps } from "data/query/typings"
import dayjs from "dayjs"

export const AuctionAction: React.FC<{ auction: any; release: ReleaseProps }> = ({ auction, release }) => {
  const now = dayjs.unix(Date.now() / 1000)
  const end = dayjs.unix(parseInt(auction?.firstBidTime + auction?.duration) as number)
  const auctionHasEnded = end.diff(now, "second") < 0 && parseInt(auction?.firstBidTime) > 0
  const auctionHasStarted = parseInt(auction?.firstBidTime) > 0

  if (auctionHasEnded) {
    return (
      <AnimatedModal
        trigger={
          <button className={"mt-4 w-full rounded bg-emerald-600 py-2 text-xl text-white hover:bg-emerald-500"}>
            Settle
          </button>
        }
        size={"auto"}
      >
        <SettleAuction release={release} auction={auction} />
      </AnimatedModal>
    )
  }

  if (auctionHasStarted) {
    return (
      <AnimatedModal
        trigger={
          <button className={"mt-4 w-full rounded bg-emerald-600 py-2 text-xl text-white hover:bg-emerald-500"}>
            Place Bid
          </button>
        }
        size={"auto"}
      >
        <CreateBid release={release} />
      </AnimatedModal>
    )
  }

  return null
}
