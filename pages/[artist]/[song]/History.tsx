import React from "react"
import useSWR from "swr"
import { tokenEventHistory } from "data/query/tokenEventHistory"
import { fetchTransaction } from "@wagmi/core"
import axios from "axios"
import { ETHER_ACTOR_BASE_URL, ETHERSCAN_BASE_URL } from "constants/etherscan"
import { ethers } from "ethers"
import dayjs from "dayjs"

const History: React.FC<{ release: any }> = ({ release }) => {
  const { data: eventHistory } = useSWR(
    release?.tokenId ? ["TokenHistory", release.tokenId] : null,
    async () => {
      const events = await tokenEventHistory(release.tokenId)

      /*
    
          get mint even details, always the last item in the array
    
         */
      const mintEvent = events[events.length - 1]
      const mintTime = mintEvent?.transactionInfo?.blockTimestamp
      const mintBlock = mintEvent?.transactionInfo?.blockNumber

      /*
    
          get transaction details for each event
    
         */
      const tx = await Promise.all(
        events.map(
          async (transaction: { transactionInfo: { transactionHash: any } }) =>
            await fetchTransaction({ hash: transaction.transactionInfo.transactionHash })
        )
      )

      const decoded = await Promise.all(
        tx.map(
          async (transaction: { to: any; data: any }) =>
            await axios(`${ETHER_ACTOR_BASE_URL}/decode/${transaction.to}/${transaction.data}`).then(res => res.data)
        )
      )

      return {
        events: events.reduce((acc: any[] = [], cv: any, i: number) => {
          const type = cv.eventType

          acc.push({ decoded: decoded[i], event: cv, tx: tx[i] })

          return acc
        }, []),
        mintTime,
        mintBlock,
      }
    },
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
    }
  )

  const transformEvent = (event: any) => {
    switch (event?.decoded?.functionName) {
      case "settleAuction":
        return !!event.event?.properties?.properties?.auction ? (
          <div>
            <div className={"text-xl"}>Auction won</div>by {event.event?.properties?.properties?.auction.highestBidder}{" "}
            for {ethers.utils.formatEther(event.event?.properties?.properties?.auction.highestBid)} ETH
          </div>
        ) : null
      case "mint":
        return (
          <div>
            <div className={"text-xl"}>Recorded Minted</div>
            {`by ${event.tx.from}`}
          </div>
        )
      case "createAuction":
        return (
          <div>
            <div className={"text-xl"}>Listed for auction</div>
            {`by ${event.tx.from}`}
          </div>
        )
      case "createBid":
        return (
          <div>
            <div className={"text-xl"}>Bid placed</div>
            {`by ${event.tx.from} for ${ethers.utils.formatEther(event.tx.value)} ETH`}
          </div>
        )
      case "setAuctionReservePrice":
        return (
          <div>
            <div className={"text-xl"}>Reserve Price Updated</div>
            {`by ${event.tx.from} to ${ethers.utils.formatEther(event?.decoded?.decoded?.[2])} ETH`}
          </div>
        )

      default:
        return `${event.decoded.name} of type ${event?.event?.eventType}`
    }
  }

  // const { data: isAuc}
  // is activeAuction
  // if yes local lst createAuction and get blocktime
  // listen to blocktime

  return (
    <div className={"max-h-96 overflow-y-scroll"}>
      {eventHistory?.events?.map((event: any) => {
        return (
          <div key={event.tx.hash}>
            {transformEvent(event) && (
              <div className={"mb-2 flex overflow-hidden break-words rounded-xl border"} key={event.tx.hash}>
                <a
                  className="inline-flex w-full flex-col p-4 hover:bg-gray-50"
                  href={`${ETHERSCAN_BASE_URL}/tx/${event.tx.hash}`}
                  target={"_blank"}
                >
                  <div>{transformEvent(event)}</div>
                  <div className={"mt-4 text-xs"}>
                    {dayjs(event.event.transactionInfo.blockTimestamp).format("MMM DD, YYYY")}
                  </div>
                </a>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default History
