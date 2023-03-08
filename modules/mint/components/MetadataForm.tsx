import { prepareWriteContract, writeContract } from '@wagmi/core'
import CID from 'cids'
import Form from 'components/Fields/Form'
import {
  metadataFields,
  metadataInitialValues,
} from 'components/Fields/fields/metadataFields'
import { HAUS_CATALOGUE_PROXY } from 'constants/addresses'
import CATALOGUE_ABI from 'data/contract/abi/HausCatalogueABI.json'
import { ethers } from 'ethers'
import { FormikHelpers, FormikValues } from 'formik'
import { NFTStorage } from 'nft.storage'
import { TokenInput } from 'nft.storage/dist/src/token'
import React from 'react'
import { AddressType } from 'typings'
import { getMerkleProof } from 'utils/merkleProof'
import { useSigner } from 'wagmi'

export const MetadataForm: React.FC<{ merkle: any }> = ({ merkle }) => {
  const client = new NFTStorage({
    token: process.env.NFT_STORAGE_TOKEN ? process.env.NFT_STORAGE_TOKEN : '',
  })
  const { data: signer } = useSigner()
  //@ts-ignore
  const signerAddress = signer?._address

  /*

        handle form submission

    */
  const submitCallBack = React.useCallback(
    async (values: FormikValues, formik?: FormikHelpers<{}>) => {
      if (!signerAddress) return

      /*

        sanitize values for Metadata Upload

      */
      values.title = values.name
      values.project.title = values.title
      values.project.description = values.description
      values.project.artwork.uri = values.image_uri
      values.project.artwork.mimeType = values.image_mimeType
      values.attributes.artist = values.artist
      values.attributes.artist_bio = values.artistBio
      values.attributes.artist_wallet = values.artistWalletAddress
      values.attributes.artist_avatar = values.artist
      const metadata = await client.store(values as TokenInput)
      /*

         construct TokenData Struct

     */
      const tokenData = {
        metadataURI: metadata.url,
        creator: ethers.utils.getAddress(signerAddress),
        royaltyPayout: ethers.utils.getAddress(signerAddress),
        royaltyBPS: 1000,
      }

      /*

           construct ContentData Struct

       */
      const cid = new CID(values.cid).toV0()
      const hash = cid.toString(cid.multibaseName)
      const contentHash = ethers.utils.base58.decode(hash).slice(2)
      const contentData = {
        contentURI: values.losslessAudio,
        contentHash,
      }

      const leaf = merkle.leaf(signerAddress)
      const proof = merkle.hexProof(leaf)

      try {
        const config = await prepareWriteContract({
          address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
          abi: CATALOGUE_ABI,
          functionName: 'mint',
          signer: signer,
          args: [tokenData, contentData, proof],
        })

        const { wait } = await writeContract(config)
        await wait()
      } catch (err) {
        console.log('err', err)
      }
    },
    [signerAddress, merkle]
  )

  return (
    <div
      className={
        'max-h-[75vh] overflow-hidden overflow-y-scroll rounded border  px-12 px-8 py-8 shadow-inner'
      }
    >
      <div className={'mb-12 text-4xl font-bold'}>Mint</div>
      <div className={'mb-24'}>
        <Form
          fields={metadataFields}
          initialValues={metadataInitialValues}
          submitCallback={submitCallBack}
        />
      </div>
    </div>
  )
}
