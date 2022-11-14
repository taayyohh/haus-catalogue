import React from "react"
import Bundlr from "@bundlr-network/client"
import { useLayoutStore } from "../../stores/useLayoutStore"
import { Formik } from "formik"
import { ethers } from "ethers"

const Upload = () => {
  const provider = useLayoutStore((state: any) => state.provider)

  /* initialize bundler */
  const bundlr = React.useMemo(async () => {
    if (!provider) return

    return new Bundlr("https://node1.bundlr.network", "matic", provider)
  }, [provider])

  /*  manage state */
  const [instance, setInstance] = React.useState(null)
  const [walletBalance, setWalletBalance] = React.useState(0)
  const [buffer, setBuffer] = React.useState(null)
  const [txId, setTxId] = React.useState(null)
  const [priceOfUpload, setPriceOfUpload] = React.useState(0)
  const [file, setFile] = React.useState({ name: "", type: "" })
  const [localUrl, setLocalUrl] = React.useState(null)

  const getBalance = React.useMemo(async () => {
    if (!instance) return
    // @ts-ignore
    const balance = await instance.getLoadedBalance()
    setWalletBalance(parseFloat(ethers.utils.formatEther(balance.toString())))
  }, [instance])

  const handleSubmit = (values: { file: any }) => {
    createBundlrTx(values.file, values.file.type)
  }

  const getPrice = React.useCallback(
    async (files: { size: any }[]) => {
      try {
        // @ts-ignore
        const price = await instance.getPrice(files[0]?.size)
        setPriceOfUpload(parseFloat(ethers.utils.formatEther(price.toString())))
      } catch (err) {
        console.log("err", err)
      }
    },
    [instance]
  )

  const getBuffer = React.useCallback(
    async (file: Blob) => {
      const blob = new Blob([file], { type: file?.type })

      let reader = new FileReader()
      reader.onload = async function (evt) {
        // @ts-ignore
        setBuffer(evt.target.result)
      }
      reader.readAsArrayBuffer(blob)
    },
    [instance]
  )

  const createBundlrTx = async (data: {}, value: string) => {
    try {
      await provider._ready()
      const tags = [{ name: "Content-Type", value }]

      const ex = await execute(await instance, tags)
      setTxId(ex)
    } catch (err) {
      console.log("err", err)
    }
  }

  const execute = React.useCallback(
    async (instance: any, tags: any) => {
      if (!buffer) return

      const tx = instance.createTransaction(buffer, { tags: tags })
      await tx.sign()
      await tx.upload()
      return (await tx.upload()).data.id
    },
    [buffer]
  )

  const handleFund = React.useCallback(
    async (price: { toString: () => string }) => {
      if (!instance) return
      try {
        const amount = ethers.utils.parseEther(price.toString()).toString()
        // @ts-ignore
        await instance.fund(amount, 1.1)
        await getBalance
      } catch (err) {
        console.log("err", err)
        await getBalance
      }
    },
    [instance]
  )

  /* styles */
  const button =
    "inline-flex self-start p-4  text-white font-bold shadow-xl rounded-xl hover: flex hover:cursor-pointer items-center justify-center mx-auto my-2 w-full"
  const infoSection = "flex flex-col items-center  p-4 rounded-xl shadow-inner mb-2"
  const infoSectionHeading = "text-lg font-bold"

  return (
    <div className="flex h-full min-h-screen justify-center">
      <div className="mx-auto flex w-1/2 max-w-xl flex-col self-center rounded-xl  p-8">
        <div className="center mb-4 flex items-center justify-center text-2xl">
          <div className="ml-2 flex">
            <div className="mr-2 flex h-8 w-8 overflow-hidden rounded-full">
              <img src="https://docs.bundlr.network/img/logo.svg" alt="bundlr logo" />
            </div>
            <a className="text-xl" href={"https://bundlr.network/"}>
              Bundlr Uploader
            </a>
          </div>
        </div>
        {(!!instance && (
          <>
            <div>
              <div className={infoSection}>
                <div className={infoSectionHeading}>Bundlr Wallet Balance</div>
                <div>{walletBalance} MATIC</div>
              </div>
              <div className={infoSection}>
                <div className={infoSectionHeading}>Price of Upload</div>
                <div>{priceOfUpload} MATIC</div>
              </div>
              {priceOfUpload - walletBalance > 0 ? (
                <div className={`${infoSection} border `}>
                  <div className={infoSectionHeading}>Funding Needed</div>
                  <div className="font-bold">{priceOfUpload - walletBalance}</div>
                </div>
              ) : null}
            </div>
            {priceOfUpload - walletBalance > 0 ? (
              <div className="flex items-center">
                <button className={button} type="button" onClick={() => handleFund(priceOfUpload)}>
                  Fund
                </button>
              </div>
            ) : null}
            <div className="flex flex-col">
              <Formik initialValues={{ file: {} }} onSubmit={values => handleSubmit(values)}>
                {props => (
                  <form onSubmit={props.handleSubmit} className="flex flex-col">
                    <>
                      {priceOfUpload && walletBalance && priceOfUpload - walletBalance <= 0 ? (
                        <button type="submit" className={`${button}  hover:bg-[#081C15]`}>
                          Submit
                        </button>
                      ) : null}

                      <label htmlFor="file-upload" className={`${button}  hover:`}>
                        Select File
                      </label>
                      <input
                        className="hidden"
                        id="file-upload"
                        name="file"
                        type="file"
                        onChange={event => {
                          // @ts-ignore
                          props.setFieldValue("file", event.currentTarget.files[0])
                          // @ts-ignore
                          setFile(event.currentTarget.files[0])
                          // @ts-ignore
                          setLocalUrl(URL?.createObjectURL(event.currentTarget.files[0]))
                          // @ts-ignore
                          getPrice(event.currentTarget.files)
                          // @ts-ignore
                          getBuffer(event.currentTarget.files[0])
                        }}
                      />
                    </>
                  </form>
                )}
              </Formik>
            </div>
          </>
        )) || (
          <div className="flex justify-center">
            <button
              type="button"
              className={button}
              onClick={async () => {
                const instance = await bundlr
                if (!!instance) {
                  await instance.ready()
                  // @ts-ignore
                  setInstance(instance)
                }
              }}
            >
              Connect to Bundlr
            </button>
          </div>
        )}
        {file.name.length > 0 ? (
          <div className={infoSection}>
            <div className={infoSectionHeading}>File to Upload:</div>
            <div className="flex w-full flex-col items-center justify-center pt-2 pb-4">
              <div>
                <span className="font-bold">name:</span> {file.name}
              </div>
              <div>
                <span className="font-bold">type:</span> {file.type}
              </div>
            </div>
            {localUrl && file.type.includes("image") && (
              <div className="flex h-32 w-32 overflow-hidden">
                <img src={localUrl} alt="uploaded image thumbnail" />
              </div>
            )}
            {localUrl && file.type.includes("audio") && (
              <audio controls>
                <source src={localUrl} type={file.type} />
              </audio>
            )}
            {localUrl && file.type.includes("video") && (
              <video controls>
                <source src={localUrl} type={file.type} />
              </video>
            )}
          </div>
        ) : null}

        {!!txId && (
          <div className={infoSection}>
            <div className={infoSectionHeading}>Uploaded File URL:</div>
            <a className="text-sm" href={`https://arweave.net/${txId}`} target="_blank">
              {`https://arweave.net/${txId}`}
            </a>
          </div>
        )}
        <div className="mt-4 flex justify-end text-xs">
          built by{" "}
          <a href={"https://github.com/taayyohh"} className="ml-1">
            taayohh
          </a>
        </div>
      </div>
    </div>
  )
}

export default Upload
