import React, { memo } from "react"
import { useAuction } from "hooks/useAuction"
import { useCountdown } from "hooks/useCountdown"
import Countdown from "./Countdown"
import { motion } from "framer-motion"
import AuctionControls from "./AuctionControls"
import Bid from "./Bid"
import PlayButton from "./PlayButton"
import { slugify, walletSnippet } from "utils/helpers"
import useHausCatalogue from "hooks/useHausCatalogue"
import Link from "next/link"
import useSWR from "swr"
import AlbumInner from "./AlbumInner"
import { HausCatalogue__factory } from "../../types/ethers-contracts"
import { useLayoutStore } from "../../stores/useLayoutStore"
import { ethers } from "ethers"

const Album: React.FC<any> = memo(({ release }) => {
  const { signer, provider, signerAddress } = useLayoutStore()
  const { auction } = useAuction(release)
  const { countdownString } = useCountdown(auction)
  // const { hausCatalogueContract } = useHausCatalogue()
  const [isHover, setIsHover] = React.useState<boolean>(false)
  const albumVariants = {
    initial: {
      y: 0,
    },
    hover: {
      y: -2,
    },
  }

  const hausCatalogueContract = HausCatalogue__factory.connect(
    process.env.HAUS_CATALOGUE_PROXY || "",
    // @ts-ignore
    signer ?? provider
  )

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
          <div className={"flex w-full flex-row items-start justify-between"}>
            <div className={"flex flex-col"}>
              <div className="text-xl font-bold">
                <Link href={`${slugify(release?.metadata?.artist)}/${slugify(release?.name)}`}>{release?.name}</Link>
              </div>

              <div>
                {" "}
                <Link href={`${slugify(release?.metadata?.artist)}`}>{release?.metadata?.artist}</Link>
              </div>
            </div>
            {auction?.notForAuction && !!release?.owner && (
              <div
                className={"relative flex cursor-default items-center gap-1 rounded-2xl bg-slate-300 px-3 py-1 text-sm"}
              >
                {isTokenOwner ? "Owner" : ` Owned: By: ${walletSnippet(release?.owner)}`}
              </div>
            )}
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
