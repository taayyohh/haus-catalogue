import React, { useRef } from "react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { ethers } from "ethers"
import useZoraV3 from "hooks/useZoraV3"
import { motion } from "framer-motion"
import { useAuction } from "hooks/useAuction"
import CreateAuction from "./CreateAuction"
import { useClickOutside } from "hooks/useClickOutside"
import useHausCatalogue from "hooks/useHausCatalogue"

const AuctionControls: React.FC<any> = ({ release }) => {
  const { zoraContracts, cancelAuction, handleApprovalManager, isModuleApproved } = useZoraV3()
  const { isApprovedForAll, handleApprovalTransferHelper } = useHausCatalogue()

  const { auction } = useAuction(release)
  const ref = useRef(null)

  /*

    handle set auction reserve price

 */

  const handleSetAuctionReservePrice = React.useCallback(() => {
    if (!zoraContracts?.ReserveAuctionCoreEth || !release) return

    zoraContracts?.ReserveAuctionCoreEth.setAuctionReservePrice(
      release?.collectionAddress,
      release?.tokenId,
      ethers.utils.parseEther(".01")
    )
  }, [zoraContracts?.ReserveAuctionCoreEth])

  /*

    handle cancel auction

 */
  const handleCancelAuction = React.useCallback(async () => {
    if (!cancelAuction) return

    await cancelAuction(release?.collectionAddress, Number(release?.tokenId))
  }, [cancelAuction])

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  useClickOutside(ref, () => setIsOpen(false))
  const dropdownVariants = {
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
    <div ref={ref}>
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
        variants={dropdownVariants}
        animate={isOpen ? "animate" : "initial"}
        className={"absolute top-1 left-5 top-9 box-border h-0 w-10/12 overflow-hidden rounded bg-white shadow-2xl"}
      >
        <div className={"mb-2 text-center text-sm font-extrabold uppercase"}>Auction Controls</div>
        {!auction?.notForAuction ? (
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
        ) : isApprovedForAll && isModuleApproved ? (
          <CreateAuction release={release} />
        ) : (
          <>
            {!isApprovedForAll && (
              <div
                className={"mb-2 flex w-full justify-center bg-rose-300 py-1 px-2 text-rose-50 hover:bg-rose-400"}
                onClick={() => handleApprovalTransferHelper()}
              >
                allow zora auction
              </div>
            )}
            {!isModuleApproved && (
              <div
                className={"mb-2 flex w-full justify-center bg-rose-300 py-1 px-2 text-rose-50 hover:bg-rose-400"}
                onClick={() => handleApprovalManager()}
              >
                allow zora manager{" "}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

export default AuctionControls
