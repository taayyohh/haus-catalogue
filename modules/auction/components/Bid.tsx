import AnimatedModal from 'components/Modal/Modal'
import { ZERO_ADDRESS, ZORA_V3_ADDRESSES } from 'constants/addresses'
import ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import { ReleaseProps } from 'data/query/typings'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import React from 'react'
import { AddressType } from 'typings'
import { useContractRead, useSigner } from 'wagmi'

import CreateBid from './CreateBid'
import SettleAuction from './SettleAuction'

interface auctionForNFTType {
  seller: AddressType
  firstBidTime: string
  duration: string
  highestBid: string
  highestBidder: string
  reservePrice: string
}

export const Bid: React.FC<{ release: ReleaseProps }> = ({ release }) => {
  const { data: signer } = useSigner()
  // @ts-ignore
  const { data: auction }: auctionForNFTType = useContractRead({
    enabled: !!release?.tokenId && !!release?.collectionAddress,
    abi: ABI,
    address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
    functionName: 'auctionForNFT',
    args: [release?.collectionAddress, release?.tokenId],
  })

  if (!auction || auction.seller === ZERO_ADDRESS) return null

  const now = dayjs.unix(Date.now() / 1000)
  const end = dayjs.unix(parseInt(auction?.firstBidTime + auction?.duration) as number)
  const auctionHasEnded =
    end.diff(now, 'second') < 0 && parseInt(auction?.firstBidTime) > 0
  const isWinner =
    end.diff(now, 'second') < 0 &&
    parseInt(auction?.firstBidTime) > 0 && //@ts-ignore
    ethers.utils.getAddress(auction?.highestBidder) === signer?._address

  return (
    <AnimatedModal
      trigger={
        auctionHasEnded && !isWinner ? undefined : (
          <div
            className={
              'relative flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-500 hover:text-white'
            }
          >
            {isWinner && <>Claim</>}
            {!auctionHasEnded && (
              <>
                <span className={'text-xs'}>Bid:</span>{' '}
                {parseFloat(ethers.utils.formatEther(auction?.highestBid)) ||
                  parseFloat(ethers.utils.formatEther(auction?.reservePrice))}
                <span>ETH</span>
              </>
            )}
          </div>
        )
      }
      size={'auto'}
    >
      {auctionHasEnded && isWinner ? (
        <SettleAuction release={release} auction={auction} />
      ) : (
        <CreateBid release={release} />
      )}
    </AnimatedModal>
  )
}
