import { ETHERSCAN_BASE_URL } from 'constants/etherscan'
import dayjs from 'dayjs'
import React from 'react'
import useSWR from 'swr'

import { transformEvent } from 'modules/auction/utils'

export const History: React.FC<{ release: any }> = ({ release }) => {
  const { data: eventHistory } = useSWR(['token-event-history', release?.tokenId])

  return (
    <div className={'max-h-96 overflow-y-scroll'}>
      {eventHistory?.events?.map((event: any, i: number) => {
        return (
          <div key={i}>
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
                    {dayjs(event.event.transactionInfo.blockTimestamp).format(
                      'MMM DD, YYYY'
                    )}
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
