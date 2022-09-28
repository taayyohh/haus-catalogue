import React from "react"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers } from "ethers"
import { useAuctionInfo } from "hooks/useAuctionInfo"
import { useCountdown } from "hooks/useCountdown"
import Countdown from "./Countdown"
import { motion } from "framer-motion"
import Admin from "./Admin"
import Bid from "./Bid"
import PlayButton from "./PlayButton"
import SellerAdmin from "./SellerAdmin"
import { walletSnippet } from "utils/helpers"

const Album: React.FC<any> = ({ release }) => {
  const { signerAddress } = useLayoutStore()
  const { auctionInfo } = useAuctionInfo(release)
  const { countdownString } = useCountdown(auctionInfo)
  const [isHover, setIsHover] = React.useState<boolean>(false)
  const albumVariants = {
    initial: {
      y: 0,
    },
    hover: {
      y: -2,
    },
  }

  React.useEffect(() => {
    if (!release?.metadata) {
      console.log("get from contract")
    }
  }, [release?.metadata])

  const isTokenOwner = React.useMemo(() => {
    if (!release?.owner) return

    return ethers.utils.getAddress(release?.owner) === signerAddress
  }, [release?.owner])

  return (
    <motion.div
      initial={"initial"}
      animate={isHover ? "hover" : "initial"}
      variants={albumVariants}
      key={release?.image}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative flex w-full flex-col items-center overflow-hidden"
    >
      <div className={"relative overflow-hidden"}>
        <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
        <PlayButton release={release} isHover={isHover} />
      </div>
      <div className="flex w-full flex-col items-start py-2">
        <div className={"flex w-full flex-row items-start justify-between"}>
          <div className={"flex flex-col"}>
            <div className="text-xl font-bold">{release?.name}</div>
            <div>{release?.metadata?.artist}</div>
          </div>
          {auctionInfo?.notForAuction && (
            <div
              className={"cursor-defaultitems-center relative flex gap-1 rounded-2xl bg-slate-300 px-3 py-1 text-sm"}
            >
              Owned: By: {walletSnippet(release.owner)}
            </div>
          )}
          {(!!auctionInfo?.highestBid || !!auctionInfo?.reservePrice) && !auctionInfo?.notForAuction && (
            <Bid release={release} />
          )}
        </div>
        {auctionInfo?.isSeller && !auctionInfo?.auctionHasStarted && <SellerAdmin release={release} />}
        {isTokenOwner && <Admin release={release} />}
        <Countdown countdownString={countdownString} />
      </div>
    </motion.div>
  )
}

export default Album
