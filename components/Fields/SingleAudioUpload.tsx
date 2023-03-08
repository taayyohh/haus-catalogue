import {
  defaultUploadStyle,
  singleImagePreview,
  singleImageUploadHelperText,
  singleImageUploadInputLabel,
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

const SingleAudioUpload: React.FC<SingleImageUploadProps> = ({ id, formik, inputLabel, helperText, value }) => {
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_TOKEN ? process.env.NFT_STORAGE_TOKEN : "" })
  const acceptableMIME = ["audio/x-wav", "audio/wav", "audio/x-aiff", "audio/mpeg"]
  const [uploadAudioError, setUploadAudioError] = React.useState<any>()
  const [preview, setPreview] = React.useState<string>("")
  const [isUploading, setIsUploading] = React.useState<boolean>(false)
  const handleFileUpload = React.useCallback(
    async (_input: FileList | null) => {
      if (!_input) return
      const audio = _input[0]
      if (audio?.type?.length && !acceptableMIME.includes(audio.type)) {
        setUploadAudioError({
          mime: `${audio.type} is an unsupported file type`,
        })
        return
      }

      // const buffer = await audio.arrayBuffer()
      // let byteArray = new Int8Array(buffer)
      // console.log(byteArray)
      // formik.setFieldValue("contentHash", byteArray)

      try {
        setIsUploading(true)
        const car = await packToBlob({
          input: [{ content: audio, path: audio.name }],
          blockstore: new MemoryBlockStore(),
        })
        const cid = await client.storeCar(car.car)
        const uri = encodeURI(urlJoin("ipfs://", cid, audio.name))
        const url = encodeURI(urlJoin("https://ipfs.io/ipfs/", cid, audio.name))
        setPreview(url)

        const au = document.createElement("audio")
        au.src = url
        au.addEventListener(
          "loadedmetadata",
          function () {
            const duration = au.duration
            formik.setFieldValue("duration", duration)
          },
          false
        )

        formik.setFieldValue(id, uri)
        formik.setFieldValue("mimeType", audio?.type)
        formik.setFieldValue("cid", cid)

        setIsUploading(false)
        setUploadAudioError(null)
      } catch (err) {
        setIsUploading(false)
        setUploadAudioError(err)
      }
    },
    [formik, client]
  )

  return (
    <div className={"mb-8 flex flex-col bg-[#F2F2F2] p-5 rounded-xl cursor-pointer border-2"}>
      <div className={"flex w-full flex-col items-center"}>
        <label className={`flex flex-col items-center justify-center`} htmlFor={`${id}_file-upload`}>
          {(isUploading && <div className={"m-0 flex items-center"}>uploading...</div>) || (
            <>
              {(value && (
                <audio controls>
                  <source src={value.replace("ipfs://", "https://nftstorage.link/ipfs/")} className={singleImagePreview} />
                </audio>
              )) || (
                <>
                  {(preview && <audio src={preview} className={singleImagePreview} />) || (
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
            id={`${id}_file-upload`}
            name="file"
            type="file"
            onChange={event => {
              handleFileUpload(event.currentTarget.files)
            }}
          />
        </label>
        {uploadAudioError?.mime && (
          <div className={`p-4 text-sm ${uploadErrorBox}`}>
            <ul className={"m-0"}>
              <li>{uploadAudioError.mime}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleAudioUpload
