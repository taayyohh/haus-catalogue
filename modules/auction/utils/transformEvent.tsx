import { ethers } from 'ethers'
import React from 'react'

import { walletSnippet } from '../../../utils'

export const transformEvent = (event: any) => {
  switch (event?.decoded?.functionName) {
    case 'settleAuction':
      return !!event.event?.properties?.properties?.auction ? (
        <div className={'flex flex-col'}>
          <div className={'text-xl'}>Auction won</div>by{' '}
          {walletSnippet(event.event?.properties?.properties?.auction.highestBidder)} for{' '}
          {ethers.utils.formatEther(
            event.event?.properties?.properties?.auction.highestBid
          )}{' '}
          ETH
        </div>
      ) : null
    case 'mint':
      return (
        <div className={'flex flex-col'}>
          <div className={'text-xl'}>Recorded Minted</div>
          <div className={'whitespace-pre-wrap'}>{`by ${walletSnippet(
            event.tx.from
          )}`}</div>
        </div>
      )
    case 'createAuction':
      return (
        <div className={'flex flex-col'}>
          <div className={'text-xl'}>Listed for auction</div>
          <div className={'whitespace-pre-wrap'}>{`by ${walletSnippet(
            event.tx.from
          )}`}</div>
        </div>
      )
    case 'createBid':
      return (
        <div className={'flex flex-col'}>
          <div className={'text-xl'}>Bid placed</div>
          <div className={'whitespace-pre-wrap'}>
            {' '}
            {`by ${walletSnippet(event.tx.from)} for ${ethers.utils.formatEther(
              event.tx.value
            )} ETH`}
          </div>
        </div>
      )
    case 'setAuctionReservePrice':
      return (
        <div className={'flex flex-col'}>
          <div className={'text-xl'}>Reserve Price Updated</div>
          <div className={'whitespace-pre-wrap'}>
            {' '}
            {`by ${walletSnippet(event.tx.from)} to ${ethers.utils.formatEther(
              event?.decoded?.decoded?.[2]
            )} ETH`}
          </div>
        </div>
      )

    default:
      return `${event.decoded.name} of type ${event?.event?.eventType}`
  }
}
