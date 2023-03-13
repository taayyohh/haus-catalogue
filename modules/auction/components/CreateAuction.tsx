import { ConnectButton } from '@rainbow-me/rainbowkit'
import { prepareWriteContract, writeContract } from '@wagmi/core'
import Form from 'components/Fields/Form'
import {
  createAuctionFields,
  createAuctionInitialValues,
} from 'components/Fields/fields/createAuctionFields'
import AnimatedModal from 'components/Modal/Modal'
import ZoraAuctionTag from 'components/ZoraAuctionTag'
import { ZORA_V3_ADDRESSES } from 'constants/addresses'
import AUCTION_ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import { ethers } from 'ethers'
import React from 'react'
import { AddressType } from 'typings'
import { toSeconds } from 'utils'
import { useSigner } from 'wagmi'

import { deployPendingButtonStyle } from './styles.css'

const CreateAuction: React.FC<any> = ({ release }) => {
  const { data: signer } = useSigner()
  const [isSubmitting, setIsSubmitting] = React.useState<undefined | boolean>(undefined)

  const handleCreateAuction = async (values: any) => {
    try {
      const config = await prepareWriteContract({
        abi: AUCTION_ABI,
        address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
        functionName: 'createAuction',
        signer: signer,
        args: [
          release?.collectionAddress,
          Number(release?.tokenId),
          toSeconds(values?.duration),
          ethers.utils.parseEther(values?.reservePrice.toString()),
          ethers.utils.getAddress(values?.sellerFundsRecipient),
          Math.floor(Date.now() / 1000),
        ],
      })
      setIsSubmitting(true)
      const { wait } = await writeContract(config)
      await wait()
      setIsSubmitting(false)
    } catch (error) {
      console.log('error', error)
      setIsSubmitting(undefined)
    } finally {
    }
  }

  return (
    <AnimatedModal
      trigger={
        <button
          className={
            'hover: mb-2 flex w-full justify-center text-white bg-emerald-600 font-bold border-black py-1 px-2 text-black border-emerald-700 rounded'
          }
        >
          create auction
        </button>
      }
      size={'auto'}
    >
      <div className={'flex flex-col'}>
        <div className={'mb-8 flex items-center gap-5'}>
          <div className={'h-20 w-20'}>
            <img
              src={release?.metadata?.project?.artwork.uri.replace(
                'ipfs://',
                'https://nftstorage.link/ipfs/'
              )}
            />
          </div>
          <div className={'flex flex-col'}>
            <div className="text-xl font-bold">{release?.name}</div>
            <div>{release?.metadata?.artist}</div>
          </div>
        </div>
        {(!!signer && (
          <>
            {isSubmitting === undefined && (
              <Form
                fields={createAuctionFields()}
                initialValues={createAuctionInitialValues}
                submitCallback={handleCreateAuction}
                buttonText={'Create Auction'}
              >
                <ZoraAuctionTag />
              </Form>
            )}
            {isSubmitting === false && (
              <div
                className={
                  'py-4 px-8 rounded-xl flex items-center justify-center bg-white text-2xl font-bold text-emerald-600'
                }
              >
                Auction Created!
              </div>
            )}
            {isSubmitting === true && (
              <div
                className={`py-4 px-8 border rounded-xl flex items-center justify-center text-white text-2xl font-bold ${deployPendingButtonStyle}`}
              >
                Creating Auction
              </div>
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
    </AnimatedModal>
  )
}

export default CreateAuction
