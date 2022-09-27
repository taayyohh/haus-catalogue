import React from "react"
import Form from "components/Fields/Form"
import { metadataFields, metadataInitialValues } from "components/Fields/fields/metadataFields"
import { NFTStorage } from "nft.storage"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers, Contract } from "ethers"
import CID from "cids"
import { FormikValues } from "formik"

const MetadataForm: React.FC<{ merkle: any; contract: Contract }> = ({ merkle, contract }) => {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN ? process.env.NFT_STORAGE_TOKEN : "" })
  const { signerAddress } = useLayoutStore()

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
      values.attributes.artist = values.artist
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
        console.log("ContentUpdated", tokenId, contentHash, contentURI)
      })
    },
    [signerAddress, merkle, contract]
  )

  return (
    <div className={"bg-gray-200 px-12 px-8 py-8 shadow-xl"}>
      <div className={"mb-8 text-3xl"}>Mint to LucidHaus Catalogue</div>
      <div className={"mb-24"}>
        <Form fields={metadataFields} initialValues={metadataInitialValues} submitCallback={submitCallBack} />
      </div>
    </div>
  )
}

export default MetadataForm
