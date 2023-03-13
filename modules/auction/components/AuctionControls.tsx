import { prepareWriteContract, writeContract } from '@wagmi/core'
import Form from 'components/Fields/Form'
import { updateReservePriceFields } from 'components/Fields/fields/updateReservePrice'
import AnimatedModal from 'components/Modal/Modal'
import {
  HAUS_CATALOGUE_PROXY,
  ZERO_ADDRESS,
  ZORA_V3_ADDRESSES,
} from 'constants/addresses'
import CATALOGUE_ABI from 'data/contract/abi/HausCatalogueABI.json'
import AUCTION_ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import ZORA_MODULE_ABI from 'data/contract/abi/ZoraModuleManager.json'
import { BigNumber, ethers } from 'ethers'
import { FormikValues } from 'formik'
import { motion } from 'framer-motion'
import { useClickOutside } from 'hooks/useClickOutside'
import React, { useRef } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AddressType } from 'typings'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from 'wagmi'

import CreateAuction from './CreateAuction'

export const AuctionControls: React.FC<any> = ({ release }) => {
  const { data: signer } = useSigner()
  const ref = useRef(null)

  const { data: auction }: any = useContractRead({
    enabled: !!release?.tokenId && !!release?.collectionAddress,
    abi: AUCTION_ABI,
    address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
    functionName: 'auctionForNFT',
    args: [release?.collectionAddress, release?.tokenId],
  })

  const { data: isModuleApproved }: any = useContractRead({
    enabled: !!signer,
    abi: ZORA_MODULE_ABI,
    address: ZORA_V3_ADDRESSES?.ZoraModuleManager as unknown as AddressType,
    functionName: 'isModuleApproved', // @ts-ignore
    args: [signer?._address, ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth],
  })

  const { config: zoraModuleApprovalConfig } = usePrepareContractWrite({
    enabled: !!ZORA_V3_ADDRESSES?.ZoraModuleManager,
    address: ZORA_V3_ADDRESSES?.ZoraModuleManager as unknown as AddressType,
    abi: ZORA_MODULE_ABI,
    functionName: 'setApprovalForModule',
    args: [ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth, true],
  })

  const { writeAsync: setApprovalForModule } = useContractWrite(zoraModuleApprovalConfig)

  const { data: isApprovedForAll }: any = useContractRead({
    enabled: !!signer,
    abi: CATALOGUE_ABI,
    address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
    functionName: 'isApprovedForAll', // @ts-ignore
    args: [signer?._address, ZORA_V3_ADDRESSES?.ERC721TransferHelper],
  })

  const allowZoraManager = async () => {
    const txn = await setApprovalForModule?.()
    await txn?.wait()
  }

  const { config: catalogueApprovalConfig } = usePrepareContractWrite({
    enabled: !!signer,
    address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
    abi: CATALOGUE_ABI,
    functionName: 'setApprovalForAll',
    args: [ZORA_V3_ADDRESSES?.ERC721TransferHelper, true],
  })
  const { writeAsync: setApprovalForAll } = useContractWrite(catalogueApprovalConfig)

  const allowZoraAuction = async () => {
    const txn = await setApprovalForAll?.()
    await txn?.wait()
  }

  const handleSetAuctionReservePrice = async (values: FormikValues) => {
    if (!release) return

    try {
      const config = await prepareWriteContract({
        abi: AUCTION_ABI,
        address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
        functionName: 'setAuctionReservePrice',
        signer: signer,
        args: [
          release?.collectionAddress,
          BigNumber.from(release?.tokenId),
          ethers.utils.parseEther(values.reservePrice.toString()),
        ],
      })

      const { wait } = await writeContract(config)
      await wait()
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleCancelAuction = async () => {
    try {
      const config = await prepareWriteContract({
        abi: AUCTION_ABI,
        address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
        functionName: 'cancelAuction',
        signer: signer,
        args: [release?.collectionAddress, BigNumber.from(release?.tokenId)],
      })

      const { wait } = await writeContract(config)
      await wait()
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleBurn = async () => {
    try {
      const config = await prepareWriteContract({
        abi: CATALOGUE_ABI,
        address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
        functionName: 'burn',
        signer: signer,
        args: [BigNumber.from(release?.tokenId)],
      })
      const { wait } = await writeContract(config)
      await wait()
    } catch (err) {
      console.log('err', err)
    }
  }

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  useClickOutside(ref, () => setIsOpen(false))

  const dropdownVariants = {
    initial: {
      height: '0',
    },
    animate: {
      height: 'auto',
      padding: 10,
      border: '1px solid #e5e7eb',
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  }
  const toggleVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 90,
    },
  }

  if (!auction) return null

  return (
    <div ref={ref}>
      <motion.div
        variants={toggleVariants}
        animate={isOpen ? 'animate' : 'initial'}
        className={
          'absolute top-1 right-1 cursor-pointer rounded bg-gray-900 p-2 shadow-xl'
        }
        onClick={() => setIsOpen((bool) => !bool)}
      >
        <BsThreeDotsVertical size={20} color={'#fff'} />
      </motion.div>
      <motion.div
        initial={'initial'}
        variants={dropdownVariants}
        animate={isOpen ? 'animate' : 'initial'}
        className={
          'absolute top-1 left-5 top-9 box-border h-0 w-10/12 overflow-hidden rounded bg-[#f9f9f9] shadow-2xl'
        }
      >
        {auction?.seller !== ZERO_ADDRESS ? (
          <>
            <AnimatedModal
              trigger={
                <button
                  className={
                    'mb-2 flex w-full justify-center rounded border bg-white py-1 px-2 text-black'
                  }
                >
                  update auction reserve price
                </button>
              }
              size={'auto'}
            >
              <Form
                fields={updateReservePriceFields}
                initialValues={{
                  reservePrice: ethers.utils.formatEther(
                    auction?.reservePrice.toString()
                  ),
                }}
                submitCallback={handleSetAuctionReservePrice}
                buttonText={'Update'}
              />
            </AnimatedModal>
            <button
              className={
                'mb-2 flex w-full justify-center rounded border bg-white py-1 px-2 text-black'
              }
              onClick={() => handleCancelAuction()}
            >
              cancel auction
            </button>
          </>
        ) : isApprovedForAll && isModuleApproved ? (
          <>
            <CreateAuction release={release} />
            <button
              className={
                'mb-2 flex w-full justify-center rounded border bg-white py-1 px-2 text-white font-bold bg-red-600 border-red-700'
              }
              onClick={() => handleBurn()}
            >
              burn token
            </button>
          </>
        ) : (
          <>
            {!isApprovedForAll && (
              <button
                className={
                  'mb-2 flex w-full justify-center rounded border bg-white py-1 px-2 text-black'
                }
                onClick={allowZoraAuction}
              >
                allow zora auction
              </button>
            )}
            {!isModuleApproved && (
              <button
                className={
                  'mb-2 flex w-full justify-center rounded border bg-white py-1 px-2 text-black'
                }
                onClick={allowZoraManager}
              >
                allow zora manager{' '}
              </button>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
