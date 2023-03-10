import { MemoryBlockStore } from 'ipfs-car/blockstore/memory'
import { packToBlob } from 'ipfs-car/pack/blob'
import { NFTStorage } from 'nft.storage'
import * as React from 'react'
import { ReactElement } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactMde from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import remarkGfm from 'remark-gfm'
import urlJoin from 'url-join'

interface MarkdownEditorProps {
  onChange: (value: string) => void
  value: string
  inputLabel: string | ReactElement
  errorMessage?: string | {}
  disabled?: boolean
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  onChange,
  value,
  inputLabel,
  errorMessage,
  disabled,
}) => {
  const client = new NFTStorage({
    token: process.env.NFT_STORAGE_TOKEN ? process.env.NFT_STORAGE_TOKEN : '',
  })
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    disabled ? 'preview' : 'write'
  )

  const saveImage = async function* (data: ArrayBuffer, blob: Blob) {
    const file = blob as File
    const car = await packToBlob({
      input: [{ content: file, path: file.name }],
      blockstore: new MemoryBlockStore(),
    })
    const cid = await client.storeCar(car.car)
    const url = encodeURI(urlJoin('https://ipfs.io/ipfs/', cid, file.name))
    yield url as string

    return true
  }

  return (
    <div className={'flex flex-col pb-8'}>
      <div className={'flex justify-between'}>
        <label className={'inline-flex font-bold text-md'}>{inputLabel}</label>
      </div>
      <ReactMde
        readOnly={disabled}
        value={value}
        onChange={onChange}
        selectedTab={!disabled ? selectedTab : 'preview'}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          )
        }
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
        paste={{
          saveImage,
        }}
      />
      {/*{!!errorMessage && <div>{errorMessage}</div>}*/}
    </div>
  )
}
