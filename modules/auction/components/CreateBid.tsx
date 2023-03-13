import { ConnectButton } from '@rainbow-me/rainbowkit'
import { prepareWriteContract, writeContract } from '@wagmi/core'
import Form from 'components/Fields/Form'
import {
  createBidFields,
  createBidInitialValues,
  validateCreateBid,
} from 'components/Fields/fields/createBidFields'
import ZoraAuctionTag from 'components/ZoraAuctionTag'
import { ZORA_V3_ADDRESSES } from 'constants/addresses'
import AUCTION_ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import { BigNumber, ethers } from 'ethers'
import Image from 'next/image'
import React from 'react'
import { mutate } from 'swr'
import { AddressType } from 'typings'
import { useBalance, useContractRead, useSigner } from 'wagmi'

import { deployPendingButtonStyle } from './styles.css'

const CreateBid: React.FC<{ release: any }> = ({ release }) => {
  const { data: signer } = useSigner()
  const { data: balance } = useBalance({
    //@ts-ignore
    address: signer?._address as `0x${string}`,
  })
  const _balance = parseFloat(balance?.formatted as string).toFixed(4)

  const { data: auction }: any = useContractRead({
    enabled: !!release?.tokenId && !!release?.collectionAddress,
    abi: AUCTION_ABI,
    address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
    functionName: 'auctionForNFT',
    args: [release?.collectionAddress, release?.tokenId],
  })

  const [isSubmitting, setIsSubmitting] = React.useState<undefined | boolean>(undefined)
  const handeCreateBid = async (values: any) => {
    try {
      const config = await prepareWriteContract({
        abi: AUCTION_ABI,
        address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
        functionName: 'createBid',
        signer: signer,
        args: [release?.collectionAddress, BigNumber.from(release?.tokenId)],
        overrides: { value: ethers.utils.parseEther(values?.amount.toString()) },
      })
      setIsSubmitting(true)
      const { wait } = await writeContract(config)
      await wait()
      setIsSubmitting(false)
      await mutate(['token-event-history', release.tokenId])
      await mutate(['auction-bid-events', release.tokenId])
      await mutate(['active-bids', release.tokenId])
    } catch (error) {
      console.log('error', error)
      setIsSubmitting(undefined)
    } finally {
    }
  }

  const auctionMinBid =
    parseFloat(ethers.utils.formatEther(auction?.highestBid)) +
      parseFloat(ethers.utils.formatEther(auction?.highestBid)) * 0.1 ||
    parseFloat(ethers.utils.formatEther(auction?.reservePrice))

  if (!auction?.seller) return null

  return (
    <div className={'flex flex-col'}>
      <div className={'mb-8 flex-col sm:flex-row flex items-center gap-5'}>
        <div className={'relative h-48 w-48 sm:h-20 sm:w-20 rounded-lg overflow-hidden'}>
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
      {(!!signer && (
        <>
          {isSubmitting === false && (
            <div
              className={
                'py-4 px-8 rounded-xl flex items-center justify-center bg-white text-2xl font-bold text-emerald-600'
              }
            >
              Bid Placed!
            </div>
          )}
          {isSubmitting === true && (
            <div
              className={`py-4 px-8 border rounded-xl flex items-center justify-center text-white text-2xl font-bold ${deployPendingButtonStyle}`}
            >
              Placing Bid
            </div>
          )}
          {isSubmitting === undefined && (
            <Form
              fields={createBidFields({
                helperText: auctionMinBid || 0,
                balance: _balance,
              })}
              initialValues={createBidInitialValues}
              validationSchema={validateCreateBid(auctionMinBid || 0)}
              submitCallback={handeCreateBid}
              buttonText={'Place Bid'}
            >
              <ZoraAuctionTag />
            </Form>
          )}
        </>
      )) || (
        <ConnectButton
          showBalance={true}
          label={'CONNECT'}
          chainStatus={'none'}
          accountStatus={'address'}
        />
      )}
    </div>
  )
}

export default CreateBid
