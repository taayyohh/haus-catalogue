import React from "react"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers } from "ethers"
import { useAuction } from "hooks/useAuction"
import { useCountdown } from "hooks/useCountdown"
import Countdown from "./Countdown"
import { motion } from "framer-motion"
import AuctionControls from "./AuctionControls"
import Bid from "./Bid"
import PlayButton from "./PlayButton"
import { walletSnippet } from "utils/helpers"
import useHausCatalogue from "hooks/useHausCatalogue"

const Album: React.FC<any> = ({ release }) => {
  const { signerAddress } = useLayoutStore()
  const { auction } = useAuction(release)
  const { countdownString } = useCountdown(auction)
  const { owner } = useHausCatalogue()
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
    if (!owner) return

    return ethers.utils.getAddress(release?.owner) === signerAddress
  }, [owner])

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
          {auction?.notForAuction && (
            <div
              className={"cursor-defaultitems-center relative flex gap-1 rounded-2xl bg-slate-300 px-3 py-1 text-sm"}
            >
             {isTokenOwner ? 'Owned' : ` Owned: By: ${walletSnippet(release?.owner)}`}
            </div>
          )}
          {(!!auction?.highestBid || !!auction?.reservePrice) && !auction?.notForAuction && (
            <Bid release={release} />
          )}
        </div>
        {isTokenOwner && !auction?.auctionHasStarted && <AuctionControls release={release} />}
        <Countdown countdownString={countdownString} />
      </div>
    </motion.div>
  )
}

export default Album
