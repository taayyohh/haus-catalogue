import React from 'react'
import useSWR from 'swr'
import { fetchTransaction } from '@wagmi/core'
import axios from 'axios'
import { ETHER_ACTOR_BASE_URL, ETHERSCAN_BASE_URL } from 'constants/etherscan'
import dayjs from 'dayjs'
import {transformEvent} from "../../utils";

export const ActiveBids: React.FC<{ history: any; tokenId: number }> = ({
  history,
  tokenId,
}) => {
  const { data: activeBids } = useSWR(
    history ? ['active-bids', tokenId] : null,
    async () => {
      const tx = await Promise.all(
        history.map(
          async (transaction: { transactionHash: any }) =>
            await fetchTransaction({ hash: transaction.transactionHash })
        )
      )

      const decoded = await Promise.all(
        tx.map(
          async (transaction: { to: any; data: any }) =>
            await axios(
              `${ETHER_ACTOR_BASE_URL}/decode/${transaction.to}/${transaction.data}`
            ).then((res) => res.data)
        )
      )

      return {
        events: history.reduce((acc: any[] = [], cv: any, i: number) => {
          acc.push({ decoded: decoded[i], event: cv, tx: tx[i] })

          return acc
        }, []),
      }
    },
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
    }
  )

  return (
    <div className={'max-h-96 overflow-y-scroll'}>
      {activeBids?.events?.map((event: any) => {
        return (
          <div key={event.tx.hash}>
            {transformEvent(event) && (
              <div
                className={'mb-2 flex overflow-hidden break-words rounded-xl border'}
                key={event.tx.hash}
              >
                <a
                  className="inline-flex w-full flex-col p-4 hover:bg-gray-50"
                  href={`${ETHERSCAN_BASE_URL}/tx/${event.tx.hash}`}
                  target={'_blank'}
                >
                  <div>{transformEvent(event)}</div>
                  <div className={'mt-4 text-xs'}>
                    {dayjs(event.event.blockTimestamp).format('MMM DD, YYYY')}
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
