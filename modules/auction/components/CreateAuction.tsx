import React from 'react'
import Form from 'components/Fields/Form'
import {
  createAuctionFields,
  createAuctionInitialValues,
} from 'components/Fields/fields/createAuctionFields'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import AnimatedModal from 'components/Modal/Modal'
import { ethers } from 'ethers'
import ZoraAuctionTag from 'components/ZoraAuctionTag'
import { prepareWriteContract, writeContract } from '@wagmi/core'
import AUCTION_ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import { ZORA_V3_ADDRESSES } from 'constants/addresses'
import { AddressType } from 'typings'
import { useSigner } from 'wagmi'
import { toSeconds } from 'utils'

const CreateAuction: React.FC<any> = ({ release }) => {
  const { data: signer } = useSigner()

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
      const { wait } = await writeContract(config)
      await wait()
    } catch (error) {
      console.log('error', error)
    } finally {
    }
  }

  return (
    <AnimatedModal
      trigger={
        <button
          className={
            'hover: mb-2 flex w-full justify-center bg-white py-1 px-2 text-black border rounded'
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
          <Form
            fields={createAuctionFields()}
            initialValues={createAuctionInitialValues}
            submitCallback={handleCreateAuction}
            buttonText={'Create Auction'}
            children={<ZoraAuctionTag />}
          />
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
