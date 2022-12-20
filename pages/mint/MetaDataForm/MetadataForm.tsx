import React from "react"
import Form from "components/Fields/Form"
import { metadataFields, metadataInitialValues } from "components/Fields/fields/metadataFields"
import { NFTStorage } from "nft.storage"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers } from "ethers"
import CID from "cids"
import { FormikValues } from "formik"
import { HausCatalogue__factory } from "types/ethers-contracts"
import { HAUS_CATALOGUE_PROXY } from "constants/addresses"

const MetadataForm: React.FC<{ merkle: any }> = ({ merkle }) => {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN ? process.env.NFT_STORAGE_TOKEN : "" })
  const { signer, provider, signerAddress } = useLayoutStore()

  const contract = HausCatalogue__factory.connect(
    HAUS_CATALOGUE_PROXY || "",
    // @ts-ignore
    signer ?? provider
  )

  /*
      
        handle form submission
       
    */
  const submitCallBack = React.useCallback(
    async (values: any, formik: FormikValues) => {
      if (!signerAddress || !contract) return

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
      const metadata = await client.store(values)
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

      /*
      
           construct proof
       
       */
      const leaf = merkle.leaf(signerAddress)
      const proof = merkle.hexProof(leaf)

      contract.mint(tokenData, contentData, proof)
      contract.on("ContentUpdated", (tokenId, contentHash, contentURI) => {
        formik.resetForm()
      })
    },
    [signerAddress, merkle, contract]
  )

  return (
    <div className={"max-h-[75vh] overflow-hidden overflow-y-scroll rounded border  px-12 px-8 py-8 shadow-inner"}>
      <div className={"mb-12 text-4xl font-bold"}>Mint</div>
      <div className={"mb-24"}>
        <Form fields={metadataFields} initialValues={metadataInitialValues} submitCallback={submitCallBack} />
      </div>
    </div>
  )
}

export default MetadataForm
