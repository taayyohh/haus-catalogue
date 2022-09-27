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
import { useCountdown } from "hooks/useCountdown"
import Countdown from "../Countdown"
import { motion } from "framer-motion"
import { BsFillPlayFill, BsThreeDotsVertical } from "react-icons/bs"
import Controls from "./Controls"

const Album: React.FC<any> = ({ release }) => {
  const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
  const { signer, signerAddress } = useLayoutStore()
  const [contract, setContract] = React.useState<any>()
  const { hausCatalogueContract } = useHausCatalogue()
  const { zoraContracts, createAuction, cancelAuction, settleAuction } = useZoraV3()
  const { auctionInfo } = useAuctionInfo({ collectionAddress: release?.collectionAddress, tokenId: release?.tokenId })
  const { countdownString } = useCountdown(auctionInfo)

  React.useEffect(() => {
    if (!release?.metadata) {
      console.log("get from contract")
    }
  }, [release?.metadata])

  const isOwner = React.useMemo(() => {
    if (!release?.owner) return
    return ethers.utils.getAddress(release?.owner) === signerAddress
  }, [release?.owner])

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

  const handleCreateBid = React.useCallback(() => {
    if (!zoraContracts?.ReserveAuctionCoreEth || !release) return

    zoraContracts?.ReserveAuctionCoreEth.createBid(release?.collectionAddress, release?.tokenId, {
      value: ethers.utils.parseEther(".09"),
    })
  }, [zoraContracts?.ReserveAuctionCoreEth])

  const [isHover, setIsHover] = React.useState<boolean>(false)
  const albumVariants = {
    initial: {
      y: 0,
    },
    hover: {
      y: -2,
    },
    hidden: {
      y: "100%",
    },
    visible: {
      y: 0,
    },
  }

  return (
    <motion.div
      initial={"initial"}
      animate={isHover ? "hover" : "initial"}
      variants={albumVariants}
      key={release?.image}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative flex w-full flex-col items-center overflow-hidden hover:cursor-pointer"
    >
      <div className={"relative overflow-hidden"}>
        <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />

        <motion.div
          variants={albumVariants}
          initial={"hidden"}
          animate={isHover ? "visible" : "hidden"}
          className={"absolute bottom-0 w-full bg-zinc-800"}
        >
          <div
            onClick={() =>
              addToQueue([
                ...queuedMusic,
                {
                  artist: release?.metadata?.artist,
                  image: release?.metadata?.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/"),
                  songs: [
                    {
                      audio: [release?.metadata?.losslessAudio.replace("ipfs://", "https://ipfs.io/ipfs/")],
                      title: release?.metadata?.title,
                      trackNumber: release?.metadata?.trackNumber,
                    },
                  ],
                },
              ])
            }
          >
            <BsFillPlayFill size={50} color={"white"} />
          </div>
        </motion.div>
      </div>
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
        {isOwner && <Controls release={release} />}
        <div className={"hover:underline"} onClick={() => handleSettleAuction()}>
          settle auction
        </div>
        <Countdown countdownString={countdownString} />
      </div>
    </motion.div>
  )
}

export default Album
