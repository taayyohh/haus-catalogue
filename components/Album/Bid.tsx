import React from "react"
import AnimatedModal from "components/Modal/Modal"
import { useAuction } from "hooks/useAuction"
import CreateBid from "./CreateBid"
import SettleAuction from "./SettleAuction"

const Bid: React.FC<any> = ({ release }) => {
  const { auction } = useAuction(release)

  return (
    <AnimatedModal
      trigger={
        auction?.auctionHasEnded && !auction.isWinner ? undefined : (
          <div
            className={
              "relative flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-500 hover:text-white"
            }
          >
            {auction?.isWinner && <>Claim</>}
            {!auction?.auctionHasEnded && (
              <>
                <span className={"text-xs"}>Bid:</span> {auction?.highestBid || auction?.reservePrice}
                <span>ETH</span>
              </>
            )}
          </div>
        )
      }
      size={"auto"}
    >
      {auction?.auctionHasEnded ? <SettleAuction release={release} /> : <CreateBid release={release} />}
    </AnimatedModal>
  )
}

export default Bid
