import { prepareWriteContract, writeContract } from '@wagmi/core'
import { HAUS_CATALOGUE_PROXY, ZORA_V3_ADDRESSES } from 'constants/addresses'
import CATALOGUE_ABI from 'data/contract/abi/HausCatalogueABI.json'
import ABI from 'data/contract/abi/HausCatalogueABI.json'
import ZORA_MODULE_ABI from 'data/contract/abi/ZoraModuleManager.json'
import { ethers } from 'ethers'
import { MerkleTree } from 'merkletreejs'
import React from 'react'
import { SWRConfig } from 'swr'
import { AddressType } from 'typings'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useSigner,
} from 'wagmi'

const keccak256 = require('keccak256')

export async function getServerSideProps() {
  const allow = process.env.MERKLE?.split(',')

  try {
    return {
      props: {
        allow,
        fallback: {
          isApprovedForAll: null,
          owner: null,
        },
      },
    }
  } catch (error: any) {
    return {
      props: {
        error: error.reason,
      },
    }
  }
}

const Settings: React.FC<any> = ({ allow }) => {
  const { data: signer } = useSigner()
  const provider = useProvider()
  //@ts-ignore
  const signerAddress = signer?._address
  const { data: isApprovedForAll }: any = useContractRead({
    enabled: !!signer,
    abi: CATALOGUE_ABI,
    address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
    functionName: 'isApprovedForAll', // @ts-ignore
    args: [signer?._address, ZORA_V3_ADDRESSES?.ERC721TransferHelper],
  })

  const { data: owner }: any = useContractRead({
    abi: ABI,
    address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
    functionName: 'owner',
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

  const { config: catalogueApprovalConfig } = usePrepareContractWrite({
    enabled: !!signer,
    address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
    abi: CATALOGUE_ABI,
    functionName: 'setApprovalForAll',
    args: [ZORA_V3_ADDRESSES?.ERC721TransferHelper, true],
  })
  const { writeAsync: setApprovalForAll } = useContractWrite(catalogueApprovalConfig)

  /*
  
    generate root
  

   */
  const leaves = allow?.map((x: string) => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const root = tree.getHexRoot()

  return (
    <div className={'mx-auto w-3/4 pt-24'}>
      <div className={'pb-8 text-4xl'}>Settings</div>
      {owner &&
        signerAddress &&
        ethers.utils.getAddress(owner) === ethers.utils.getAddress(signerAddress) && (
          <div>
            <div>
              <div>The Merkle Proof Root</div>

              <button
                className={
                  'inline-flex self-start rounded-xl border-2 border-rose-400 py-2 px-4 text-rose-400 hover: hover:text-white'
                }
                onClick={async () => {
                  const config = await prepareWriteContract({
                    address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
                    abi: CATALOGUE_ABI,
                    functionName: 'updateRoot',
                    signer: signer,
                    args: [root],
                  })

                  const { wait } = await writeContract(config)
                  await wait()
                }}
              >
                update root
              </button>
            </div>
          </div>
        )}
      {isApprovedForAll === false && (
        <div
          onClick={async () => {
            const txn = await setApprovalForAll?.()
            await txn?.wait()
          }}
        >
          allow zora auction
        </div>
      )}
      {isModuleApproved === false && (
        <div
          onClick={async () => {
            const txn = await setApprovalForModule?.()
            await txn?.wait()
          }}
        >
          allow zora manager
        </div>
      )}
    </div>
  )
}

export default function SettingsPage({ fallback, allow }: any) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Settings allow={allow} />
    </SWRConfig>
  )
}
