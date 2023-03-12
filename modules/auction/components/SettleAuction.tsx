import { prepareWriteContract, writeContract } from '@wagmi/core'
import { defaultFormButton } from 'components/Fields/styles.css'
import { ZORA_V3_ADDRESSES } from 'constants/addresses'
import ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import { BigNumber } from 'ethers'
import React from 'react'
import { AddressType } from 'typings'
import { useSigner } from 'wagmi'

import ZoraAuctionTag from '../../../components/ZoraAuctionTag'
import { ReleaseProps } from '../../../data/query/typings'

const SettleAuction: React.FC<{ release: ReleaseProps; auction: any }> = ({
  release,
  auction,
}) => {
  const { data: signer } = useSigner()
  const [status, setStatus] = React.useState('inactive')
  const handleSettleAuction = async () => {
    const config = await prepareWriteContract({
      abi: ABI,
      address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
      functionName: 'settleAuction',
      signer: signer,
      args: [release?.collectionAddress, BigNumber.from(release?.tokenId)],
    })
    setStatus('pending')
    const { wait } = await writeContract(config)
    await wait()
    setStatus('success')
  }

  //@ts-ignore
  if (auction?.seller !== signer?._address) return null

  return (
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
      <div className={'mb-20'}>
        Congrats! You have won! Settle the auction to claim your NFT.
      </div>
      {status === 'pending' && (
        <div>
          <div>claiming</div>
        </div>
      )}
      {status === 'success' && (
        <div>
          <div>success!</div>
        </div>
      )}
      <button
        className={` hover: text-rose-50 hover:text-rose-100 ${defaultFormButton}`}
        onClick={() => handleSettleAuction()}
      >
        Settle Auction
      </button>
      <ZoraAuctionTag />
    </div>
  )
}

export default SettleAuction
