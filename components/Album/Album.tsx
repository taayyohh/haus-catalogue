import React, { memo } from "react"
import { useAuction } from "hooks/useAuction"
import { useCountdown } from "hooks/useCountdown"
import Countdown from "./Countdown"
import { motion } from "framer-motion"
import AuctionControls from "./AuctionControls"
import Bid from "./Bid"
import { slugify } from "utils/helpers"
import Link from "next/link"
import AlbumInner from "./AlbumInner"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers } from "ethers"

interface SongProps {

}

const Album: React.FC<any> = memo(({ release }) => {
  const { signerAddress } = useLayoutStore()
  const { auction } = useAuction(release)
  const { countdownString } = useCountdown(auction)
  const [isHover, setIsHover] = React.useState<boolean>(false)
  const albumVariants = {
    initial: {
      y: 0,
    },
    hover: {
      y: -2,
    },
  }

  const isTokenOwner = React.useMemo(() => {
    if (!signerAddress || !release?.owner) return

    return ethers.utils.getAddress(signerAddress) === ethers.utils.getAddress(release?.owner)
  }, [signerAddress, release?.owner])

  return (
    <div>
      <motion.div
        initial={"initial"}
        animate={isHover ? "hover" : "initial"}
        variants={albumVariants}
        key={release?.image}
        className="relative flex w-full flex-col items-center overflow-hidden"
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <AlbumInner release={release} />
        <div className="flex w-full flex-col items-start py-2">
          <div className={"flex w-full flex-col items-start justify-between gap-1 sm:flex-row"}>
            <div className={"my-1 flex flex-col sm:my-0"}>
              <div className="text-xl font-bold">
                {release?.metadata?.artist && (
                  <Link href={`${slugify(release?.metadata?.artist)}/${slugify(release?.name)}`}>{release?.name}</Link>
                )}
              </div>
              <div className={"hover:opacity-80"}>
                {release?.metadata?.artist && (
                  <Link href={`${slugify(release?.metadata?.artist)}`}>{release?.metadata?.artist}</Link>
                )}
              </div>
            </div>
            {(!!auction?.highestBid || !!auction?.reservePrice) && !auction?.notForAuction && <Bid release={release} />}
          </div>
          {isTokenOwner && !auction?.auctionHasStarted && <AuctionControls release={release} />}
          <Countdown countdownString={countdownString} />
        </div>
      </motion.div>
    </div>
  )
})

export default Album
