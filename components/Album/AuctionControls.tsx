import React from "react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { ethers } from "ethers"
import { toSeconds } from "utils/helpers"
import useZoraV3 from "hooks/useZoraV3"
import { motion } from "framer-motion"
import { useAuction } from "hooks/useAuction"
import AnimatedModal from "components/Modal/Modal"
import Form from "components/Fields/Form"
import { createAuctionFields, createAuctionInitialValues } from "components/Fields/fields/createAuctionFields"
import { createBidInitialValues } from "components/Fields/fields/createBidFields"
import CreateAuction from "./CreateAuction";

const AuctionControls: React.FC<any> = ({ release }) => {
  const { zoraContracts, createAuction, cancelAuction } = useZoraV3()
  const { auction } = useAuction(release)

  /*

  handle create auction

 */
  const handleCreateAuction = React.useCallback(
    async (values: any) => {
      if (!createAuction) return

      console.log("v", values)

      //duration
      //reservePrice
      //sellerFundsRecipient

      // await createAuction(
      //   release?.collectionAddress,
      //   Number(release?.tokenId),
      //   toSeconds({ minutes: 2 }),
      //   ethers.utils.parseEther(".05"),
      //   release.owner,
      //   Math.floor(Date.now() / 1000)
      // )
    },
    [createAuction, release]
  )

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

    await cancelAuction(release?.collectionAddress, Number(release?.tokenId))
  }, [cancelAuction])

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const variants = {
    initial: {
      height: "0",
    },
    animate: {
      height: "auto",
      padding: 10,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  }

  const toggleVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 90,
    },
  }

  return (
    <div>
      <motion.div
        variants={toggleVariants}
        animate={isOpen ? "animate" : "initial"}
        className={"absolute top-1 right-1 cursor-pointer rounded-full bg-white p-2 shadow-2xl shadow-rose-300"}
        onClick={() => setIsOpen(bool => !bool)}
      >
        <BsThreeDotsVertical size={16} />
      </motion.div>
      <motion.div
        initial={"initial"}
        variants={variants}
        animate={isOpen ? "animate" : "initial"}
        className={"absolute top-1 left-5 top-9 box-border h-0 w-10/12 overflow-hidden rounded bg-white shadow-2xl"}
      >
        <div className={"mb-2 text-center text-sm font-extrabold uppercase"}>Auction Controls</div>
        {(!auction?.notForAuction && (
          <>
            <div
              className={"mb-2 flex w-full justify-center bg-rose-300 py-1 px-2 text-rose-50 hover:bg-rose-400"}
              onClick={() => handleSetAuctionReservePrice()}
            >
              update auction reserve price
            </div>
            <div
              className={"mb-2 flex w-full justify-center bg-rose-300 py-1 px-2 text-rose-50 hover:bg-rose-400"}
              onClick={() => handleCancelAuction()}
            >
              cancel auction
            </div>
          </>
        )) || (
            <CreateAuction release={release} />
        )}
      </motion.div>
    </div>
  )
}

export default AuctionControls
