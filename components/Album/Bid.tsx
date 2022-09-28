import React from "react"
import AnimatedModal from "components/Modal/Modal"
import { ethers } from "ethers"
import useZoraV3 from "hooks/useZoraV3"
import { useAuctionInfo } from "hooks/useAuctionInfo"
import Form from "components/Fields/Form"
import { createBidFields, createBidInitialValues, validateCreateBid } from "components/Fields/fields/createBidFields"

const Bid: React.FC<any> = ({ release }) => {
  const { zoraContracts } = useZoraV3()
  const { auctionInfo } = useAuctionInfo(release)

  /*

  handle settle auction

 */
  // const handleSettleAuction = React.useCallback(async () => {
  //     if (!createAuction) return
  //
  //     await settleAuction(release?.collectionAddress, Number(release?.tokenId))
  // }, [createAuction])

  /*
  
     handle create bid
  
    */

  const handleCreateBid = React.useCallback(
    (values: any) => {
      if (!zoraContracts?.ReserveAuctionCoreEth || !release) return

      zoraContracts?.ReserveAuctionCoreEth.createBid(release?.collectionAddress, release?.tokenId, {
        value: ethers.utils.parseEther(values?.amount.toString()),
      })
    },
    [zoraContracts?.ReserveAuctionCoreEth]
  )

  const minBidEth = React.useMemo(() => {
    if (!auctionInfo) return 0

    return auctionInfo?.highestBid + auctionInfo?.highestBid * 0.1
  }, [auctionInfo])

  // console.log("a", auctionInfo)
  return (
    <AnimatedModal
      trigger={
        <div
          className={
            "relative flex cursor-pointer items-center gap-1 rounded-2xl bg-rose-300 px-3 py-1 text-sm hover:bg-rose-700 hover:text-white"
          }
        >
          <span className={"text-xs"}>Bid:</span> {auctionInfo?.highestBid || auctionInfo?.reservePrice}
          <span>ETH</span>
        </div>
      }
      size={"auto"}
    >
      <div className={"flex flex-col"}>
        <div className={"mb-8 flex items-center gap-5"}>
          <div className={"h-20 w-20"}>
            <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
          </div>
          <div className={"flex flex-col"}>
            <div className="text-xl font-bold">{release?.name}</div>
            <div>{release?.metadata?.artist}</div>
          </div>
        </div>
        <Form
          fields={createBidFields({ helperText: minBidEth })}
          initialValues={createBidInitialValues}
          validationSchema={validateCreateBid(minBidEth)}
          submitCallback={handleCreateBid}
          buttonText={"Place Bid"}
        />
      </div>
    </AnimatedModal>
  )
}

export default Bid
