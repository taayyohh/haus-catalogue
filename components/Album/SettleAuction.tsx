import React from "react"
import useZoraV3 from "hooks/useZoraV3"
import { defaultFormButton } from "components/Fields/styles.css"

const SettleAuction: React.FC<any> = ({ release }) => {
  const { settleAuction } = useZoraV3()

  /*
    
    handle settle auction
    
    */
  const handleSettleAuction = React.useCallback(async () => {
    if (!settleAuction) return

    await settleAuction(release?.collectionAddress, Number(release?.tokenId))
  }, [settleAuction])

  return (
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
      <div className={"mb-20"}>Congrats! You have won! Settle the auction to claim your NFT.</div>
      <button
        className={`bg-rose-500 text-rose-50 hover:bg-rose-600 hover:text-rose-100 ${defaultFormButton}`}
        onClick={() => handleSettleAuction()}
      >
        Settle Auction
      </button>
    </div>
  )
}

export default SettleAuction
