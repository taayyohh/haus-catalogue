import { prepareWriteContract, writeContract } from '@wagmi/core'
import { defaultFormButton } from 'components/Fields/styles.css'
import ZoraAuctionTag from 'components/ZoraAuctionTag'
import { ZORA_V3_ADDRESSES } from 'constants/addresses'
import ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import { ReleaseProps } from 'data/query/typings'
import { BigNumber, ethers } from 'ethers'
import { useEnsData } from 'hooks/useEnsData'
import Image from 'next/image'
import React from 'react'
import { AddressType } from 'typings'
import { useSigner } from 'wagmi'

import { deployPendingButtonStyle } from './styles.css'

const SettleAuction: React.FC<{ release: ReleaseProps; auction: any }> = ({
  release,
  auction,
}) => {
  const { data: signer } = useSigner()
  const [isSubmitting, setIsSubmitting] = React.useState<undefined | boolean>(undefined)
  //@ts-ignore
  const { displayName, ensAvatar } = useEnsData(signer?._address as string)

  const handleSettleAuction = async () => {
    try {
      const config = await prepareWriteContract({
        abi: ABI,
        address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
        functionName: 'settleAuction',
        signer: signer,
        args: [release?.collectionAddress, BigNumber.from(release?.tokenId)],
      })
      setIsSubmitting(true)
      const { wait } = await writeContract(config)
      await wait()
      setIsSubmitting(false)
    } catch (err) {
      setIsSubmitting(undefined)
      console.log(err)
    }
  }

  //@ts-ignore
  if (auction?.seller !== signer?._address) return null

  return (
    <div className={'flex flex-col'}>
      <>
        <div className={'mb-8 flex flex-col sm:flex-row items-center gap-5'}>
          <div
            className={'relative h-48 w-48 sm:h-20 sm:w-20 rounded-lg overflow-hidden'}
          >
            <Image
              fill
              src={release?.metadata?.project?.artwork.uri.replace(
                'ipfs://',
                'https://nftstorage.link/ipfs/'
              )}
              alt={`${release?.name} cover art`}
            />
          </div>
          <div className={'flex flex-col'}>
            <div className="text-xl font-bold">{release?.name}</div>
            <div>{release?.metadata?.artist}</div>
          </div>
        </div>
        <div className={'text-3xl font-bold w-3/4 mx-auto text-center mb-8'}>
          <div className={'flex mb-4 text-center items-center justify-center'}>
            Congrats {displayName}!
          </div>
          You have won
          <span>
            <em className={'text-emerald-600'}> {release?.name} </em> by
            <em className={'text-emerald-600'}>{release?.metadata?.artist}</em> for a
            final bid of
            <em className={'text-emerald-600'}>
              {ethers.utils.formatEther(auction?.highestBid)} ETH
            </em>.
          </span>{' '}
          Settle the auction to claim your NFT.
        </div>
        {isSubmitting === undefined && (
          <button
            className={
              'py-4 px-8 rounded-xl flex items-center justify-center text-white text-2xl font-bold bg-emerald-600'
            }
            onClick={() => handleSettleAuction()}
          >
            Settle Auction
          </button>
        )}
        {isSubmitting === true && (
          <div
            className={`py-4 px-8 border rounded-xl flex items-center justify-center text-white text-2xl font-bold ${deployPendingButtonStyle}`}
          >
            Settling
          </div>
        )}
        {isSubmitting === false && (
          <div
            className={
              'py-4 px-8 rounded-xl flex items-center justify-center bg-white text-2xl font-bold text-emerald-600'
            }
          >
            Claimed
          </div>
        )}
      </>
      <ZoraAuctionTag />
    </div>
  )
}

export default SettleAuction
