import React from "react"
import useZoraV3 from "hooks/useZoraV3"
import { defaultFormButton } from "components/Fields/styles.css"
import ZoraAuctionTag from "../Layout/ZoraAuctionTag"

const SettleAuction: React.FC<any> = ({ release }) => {
  const { settleAuction } = useZoraV3()

  /*
    
    handle settle auction
    
    */
  const [status, setStatus] = React.useState("inactive")
  const handleSettleAuction = React.useCallback(async () => {
    if (!settleAuction) return

    const { wait } = await settleAuction(release?.collectionAddress, Number(release?.tokenId))
    setStatus("pending")
    await wait()
    setStatus("success")
  }, [settleAuction])

  return (
    <div className={"flex flex-col"}>
      <div className={"mb-8 flex items-center gap-5"}>
        <div className={"h-20 w-20"}>
          <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://nftstorage.link/ipfs/")} />
        </div>
        <div className={"flex flex-col"}>
          <div className="text-xl font-bold">{release?.name}</div>
          <div>{release?.metadata?.artist}</div>
        </div>
      </div>
      <div className={"mb-20"}>Congrats! You have won! Settle the auction to claim your NFT.</div>
      {status === "pending" && (
        <div>
          <div>claiming</div>
        </div>
      )}
      {status === "success" && (
        <div>
          <div>success!</div>
        </div>
      )}
      <button
        className={` hover: text-rose-50 hover:text-rose-100 ${defaultFormButton}`}
        onClick={() => handleSettleAuction()}
      >
        Settle Auction
      </button>
      <ZoraAuctionTag />
    </div>
  )
}

export default SettleAuction
