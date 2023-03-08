import React, { memo } from "react"
import { useCountdown } from "hooks/useCountdown"
import Countdown from "./Countdown"
import { motion } from "framer-motion"
import { AuctionControls, Bid } from "modules/auction/components"
import Link from "next/link"
import SongCardInner from "./SongCardInner"
import { ethers } from "ethers"
import { useContractRead, useSigner } from "wagmi"
import ABI from "data/contract/abi/ReserveAuctionCoreETH.json"
import { ZERO_ADDRESS, ZORA_V3_ADDRESSES } from "constants/addresses"
import { AddressType } from "typings"
import { slugify } from "utils"

export const SongCard: React.FC<any> = memo(({ release }) => {
  const { data: signer } = useSigner()
  //@ts-ignore
  const signerAddress = signer?._address
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

  const { data: auction }: any = useContractRead({
    enabled: !!release?.tokenId && !!release?.collectionAddress,
    abi: ABI,
    address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
    functionName: "auctionForNFT",
    args: [release?.collectionAddress, release?.tokenId],
  })
  const { countdownString } = useCountdown(auction)
  const auctionHasStarted = parseInt(auction?.firstBidTime) > 0
  const notForAuction = auction?.seller === ZERO_ADDRESS

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
        <SongCardInner release={release} />
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
            {(!!auction?.highestBid || !!auction?.reservePrice) && !notForAuction && <Bid release={release} />}
          </div>
          {isTokenOwner && !auctionHasStarted && <AuctionControls release={release} />}
          <Countdown countdownString={countdownString} />
        </div>
      </motion.div>
    </div>
  )
})
