import React from "react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { ethers } from "ethers"
import { toSeconds } from "utils/helpers"
import useZoraV3 from "hooks/useZoraV3"
import { motion } from "framer-motion"

const Controls: React.FC<any> = ({ release }) => {
  const { zoraContracts, createAuction, cancelAuction, settleAuction } = useZoraV3()

  /*

  handle create auction

 */
  const handleCreateAuction = React.useCallback(async () => {
    if (!createAuction) return

    await createAuction(
      release?.collectionAddress,
      Number(release?.tokenId),
      toSeconds({ days: 1 }),
      ethers.utils.parseEther(".05"),
      release.owner,
      Math.floor(Date.now() / 1000)
    )
  }, [createAuction, release])

  const handleSetAuctionReservePrice = React.useCallback(() => {
    if (!zoraContracts?.ReserveAuctionCoreEth || !release) return

    zoraContracts?.ReserveAuctionCoreEth.setAuctionReservePrice(
      release?.collectionAddress,
      release?.tokenId,
      ethers.utils.parseEther(".01")
    )
  }, [zoraContracts?.ReserveAuctionCoreEth])

  const handleCancelAuction = React.useCallback(async () => {
    if (!cancelAuction) return

    await settleAuction(release?.collectionAddress, Number(release?.tokenId))
  }, [cancelAuction])

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const variants = {
    initial: {
      height: "0",
    },
    animate: {
      height: "auto",
    },
  }

  return (
    <div>
      <div
        className={"absolute top-1 right-1 rounded-full bg-white p-2 shadow-2xl shadow-rose-300"}
        onClick={() => setIsOpen(bool => !bool)}
      >
        <BsThreeDotsVertical size={16} />
      </div>
      <motion.div
        initial={"initial"}
        variants={variants}
        animate={isOpen ? "animate" : "initial"}
        className={" absolute top-1 left-5 top-9 box-border h-0 w-10/12 overflow-hidden rounded bg-white p-4"}
      >
        <div className={"hover:underline"} onClick={() => handleSetAuctionReservePrice()}>
          update auction reserve price
        </div>
        <div className={"hover:underline"} onClick={() => handleCreateAuction()}>
          create auction
        </div>
        <div className={"hover:underline"} onClick={() => handleCancelAuction()}>
          cancel auction
        </div>
      </motion.div>
    </div>
  )
}

export default Controls
