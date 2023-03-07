import { ethers } from 'ethers'
import React from 'react'

export const transformEvent = (event: any) => {
  switch (event?.decoded?.functionName) {
    case 'settleAuction':
      return !!event.event?.properties?.properties?.auction ? (
        <div>
          <div className={'text-xl'}>Auction won</div>by{' '}
          {event.event?.properties?.properties?.auction.highestBidder} for{' '}
          {ethers.utils.formatEther(
            event.event?.properties?.properties?.auction.highestBid
          )}{' '}
          ETH
        </div>
      ) : null
    case 'mint':
      return (
        <div>
          <div className={'text-xl'}>Recorded Minted</div>
          {`by ${event.tx.from}`}
        </div>
      )
    case 'createAuction':
      return (
        <div>
          <div className={'text-xl'}>Listed for auction</div>
          {`by ${event.tx.from}`}
        </div>
      )
    case 'createBid':
      return (
        <div>
          <div className={'text-xl'}>Bid placed</div>
          {`by ${event.tx.from} for ${ethers.utils.formatEther(event.tx.value)} ETH`}
        </div>
      )
    case 'setAuctionReservePrice':
      return (
        <div>
          <div className={'text-xl'}>Reserve Price Updated</div>
          {`by ${event.tx.from} to ${ethers.utils.formatEther(
            event?.decoded?.decoded?.[2]
          )} ETH`}
        </div>
      )

    default:
      return `${event.decoded.name} of type ${event?.event?.eventType}`
  }
}
