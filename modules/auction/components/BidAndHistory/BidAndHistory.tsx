import { History } from './History'
import { ActiveBids } from './ActiveBids'
import React from 'react'
import { ReleaseProps } from 'data/query/typings'
import useSWR from 'swr'
import { ethers } from 'ethers'
import { HAUS_CATALOGUE_PROXY, ZORA_V3_ADDRESSES } from 'constants/addresses'
import { tokenEventHistory } from 'data/query/tokenEventHistory'
import { fetchTransaction } from '@wagmi/core'
import axios from 'axios'
import { ETHER_ACTOR_BASE_URL } from 'constants/etherscan'
import { useContract, useProvider, useSigner } from 'wagmi'
import AUCTION_ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import { AddressType } from '../../../../typings'

export const BidAndHistory: React.FC<{ release: ReleaseProps; auction: any }> = ({
  release,
  auction,
}) => {
  const [activeTab, setIsActiveTab] = React.useState('')
  const { data: signer } = useSigner()
  const provider = useProvider()

  const { data: eventHistory } = useSWR(
    release?.tokenId ? ['token-event-history', release.tokenId] : null,
    async () => {
      try {
        const events = await tokenEventHistory(release.tokenId)

        // get transaction details for each event
        const tx = await Promise.all(
          events.map(
            async (transaction: { transactionInfo: { transactionHash: any } }) =>
              await fetchTransaction({
                hash: transaction.transactionInfo.transactionHash,
              })
          )
        )

        const decoded = await Promise.all(
          tx.map(
            async (transaction: { to: any; data: any }) =>
              await axios.post(`${ETHER_ACTOR_BASE_URL}/decode/`, {
                address: transaction.to,
                calldata: transaction.data,
              })
          )
        )

        return {
          events: events.reduce((acc: any[] = [], cv: any, i: number) => {
            acc.push({ decoded: decoded[i].data, event: cv, tx: tx[i] })

            return acc
          }, []),
        }
      } catch (err) {
        console.log('err', err)
      }
    },
    {
      revalidateOnMount: true,
      revalidateIfStale: true,
      revalidateOnFocus: true,
    }
  )

  const auctionBlockStart = React.useMemo(() => {
    const latestCreateAuction = eventHistory?.events?.filter(
      (item: { decoded: { functionName: string } }) =>
        item.decoded.functionName === 'createAuction'
    )?.[0]

    if (!latestCreateAuction || parseInt(auction?.firstBidTime) === 0) return

    return latestCreateAuction.event.transactionInfo.blockNumber
  }, [eventHistory, auction])

  // const { data: ReserveAuctionCoreEth } = useSWR('ReserveAuctionCoreEth')
  const ReserveAuctionCoreEth = useContract({
    address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
    abi: AUCTION_ABI,
    signerOrProvider: signer ?? provider,
  })

  const { data: activeAuctionBids } = useSWR(
    auctionBlockStart && release?.tokenId && ReserveAuctionCoreEth
      ? ['auction-bid-events', release.tokenId]
      : null,
    async () => {
      const events = await ReserveAuctionCoreEth?.queryFilter(
        'AuctionBid' as any,
        auctionBlockStart,
        'latest'
      )

      return events
        ?.filter(
          (event: any) =>
            ethers.utils.getAddress(event.args.tokenContract) ===
              ethers.utils.getAddress(HAUS_CATALOGUE_PROXY) &&
            Number(event.args.tokenId) === Number(release?.tokenId)
        )
        .reverse()
    },
    { revalidateOnFocus: false }
  )

  React.useEffect(() => {
    setIsActiveTab(activeAuctionBids ? 'Bid' : 'History')
  }, [activeAuctionBids])

  return (
    <div>
      <div className={'flex gap-5'}>
        <div
          className={`cursor-pointer text-2xl font-bold ${
            activeTab === 'Bid' ? 'text-emerald-500' : 'hover:text-emerald-500'
          }`}
          onClick={() => setIsActiveTab('Bid')}
        >
          Bid
        </div>
        <div
          className={`cursor-pointer text-2xl font-bold ${
            activeTab === 'History' ? 'text-emerald-500 ' : ' hover:text-emerald-500'
          } `}
          onClick={() => setIsActiveTab('History')}
        >
          History
        </div>
      </div>
      <div className={'mt-2 box-border rounded-xl border bg-white p-8'}>
        {activeTab === 'History' && <History release={release} />}
        {activeTab === 'Bid' && (
          <>
            {activeAuctionBids ? (
              <ActiveBids
                history={activeAuctionBids}
                tokenId={Number(release?.tokenId)}
              />
            ) : (
              <div>No Active Auction.</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
