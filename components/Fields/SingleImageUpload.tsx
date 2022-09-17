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

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({ id, formik, inputLabel, helperText, value }) => {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN ? process.env.NFT_STORAGE_TOKEN : "" })
  const acceptableMIME = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"]
  const [uploadArtworkError, setUploadArtworkError] = React.useState<any>()
  const [preview, setPreview] = React.useState<string>("")
  const [isUploading, setIsUploading] = React.useState<boolean>(false)
  const handleFileUpload = React.useCallback(
    async (_input: FileList | null) => {
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
        formik.setFieldValue('project.artwork.uri', uri)
        formik.setFieldValue('project.artwork.mimeType', input.type)

        setIsUploading(false)
        setUploadArtworkError(null)
      } catch (err) {
        setIsUploading(false)
        setUploadArtworkError(err)
      }
    },
    [formik, client]
  )

  return (
    <div className={"mb-8 flex flex-col"}>
      <div className={"flex w-full flex-col items-center"}>
        <label
          className={`flex flex-col items-center justify-center ${singleImageUploadWrapper}`}
          htmlFor="audio-file-upload"
        >
          {(isUploading && <div className={"m-0 flex items-center"} />) || (
            <>
              {(value && (
                  <></>
                // <img src={value.replace("ipfs://", "https://ipfs.io/ipfs/")} className={singleImagePreview} />
              )) || (
                <>
                  {(preview && <img src={preview} className={singleImagePreview} />) || (
                    <>
                      <div className={`flex ${singleImageUploadInputLabel}`}>{inputLabel}</div>
                      <div className={`flex ${singleImageUploadHelperText}`}>{helperText}</div>
                    </>
                  )}
                </>
              )}
            </>
          )}
          <input
            className={defaultUploadStyle}
            id="audio-file-upload"
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
