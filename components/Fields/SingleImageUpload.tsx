import {
  defaultUploadStyle,
  singleImagePreview,
  singleImageUploadHelperText,
  singleImageUploadInputLabel,
  singleImageUploadWrapper,
  uploadErrorBox,
} from "./styles.css"
import { FormikProps } from "formik"
import { MemoryBlockStore } from "ipfs-car/blockstore/memory"
import { packToBlob } from "ipfs-car/pack/blob"
import React from "react"

import urlJoin from "url-join"
import { NFTStorage } from "nft.storage"

interface SingleImageUploadProps {
  formik: FormikProps<any>
  id: string
  inputLabel: string
  helperText: string | undefined
  value: string
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({ id, formik, inputLabel, helperText }) => {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN ? process.env.NFT_STORAGE_TOKEN : "" })
  const acceptableMIME = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"]
  const [uploadArtworkError, setUploadArtworkError] = React.useState<any>()
  const [preview, setPreview] = React.useState<string>("")
  const [isUploading, setIsUploading] = React.useState<boolean>(false)
  const handleFileUpload = async (_input: FileList | null) => {
    if (!_input) return
    const input = _input[0]

    if (input?.type?.length && !acceptableMIME.includes(input.type)) {
      setUploadArtworkError({
        mime: `${input.type} is an unsupported file type`,
      })
      return
    }

    try {
      setIsUploading(true)
      const car = await packToBlob({
        input: [{ content: input, path: input.name }],
        blockstore: new MemoryBlockStore(),
      })
      const cid = await client.storeCar(car.car)
      const uri = encodeURI(urlJoin("ipfs://", cid, input.name))
      const url = encodeURI(urlJoin("https://ipfs.io/ipfs/", cid, input.name))
      setPreview(url)
      formik.setFieldValue(id, car.car)
      formik.setFieldValue(`${id}_preview`, url)
      formik.setFieldValue(`${id}_uri`, uri)
      formik.setFieldValue(`${id}_mimeType`, input.type)

      setIsUploading(false)
      setUploadArtworkError(null)
    } catch (err) {
      setIsUploading(false)
      setUploadArtworkError(err)
    }
  }

  return (
    <div className={"relative mb-8 flex flex-col"}>
      <div className={"relative flex w-full flex-col items-center"}>
        <label
          className={`flex flex-col items-center justify-center round ${singleImageUploadWrapper}`}
          htmlFor={`${id}_audio-file-upload`}
        >
          {(isUploading && <div className={"m-0 flex items-center"} />) || (
            <>
              <>
                {(preview && <img src={preview} className={singleImagePreview} alt={"preview"} />) || (
                  <>
                    <div className={`flex ${singleImageUploadInputLabel}`}>{inputLabel}</div>
                    <div className={`flex ${singleImageUploadHelperText}`}>{helperText}</div>
                  </>
                )}
              </>
            </>
          )}
          <input
            className={defaultUploadStyle}
            id={`${id}_audio-file-upload`}
            name="file"
            type="file"
            multiple={true}
            onChange={event => {
              handleFileUpload(event.currentTarget.files)
            }}
          />
        </label>
        {uploadArtworkError?.mime && (
          <div className={`p-4 text-sm ${uploadErrorBox}`}>
            <ul className={"m-0"}>
              <li>{uploadArtworkError.mime}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleImageUpload
