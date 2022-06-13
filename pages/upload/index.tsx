import React from 'react'
import Bundlr from "@bundlr-network/client";
import {useLayoutStore} from "../../stores/useLayoutStore";
import {Formik} from 'formik';
import {ethers} from "ethers";

const Upload = () => {
    const signer = useLayoutStore((state: any) => state.signer)
    const provider = useLayoutStore((state: any) => state.provider)
    const bundlr = React.useMemo(async () => {
        if(!provider) return
        return new Bundlr("https://node1.bundlr.network", "matic", provider)
    }, [provider])

    const [instance, setInstance] = React.useState(null)
    const [walletBalance, setWalletBalance] = React.useState(0)
    const getBalance = React.useMemo(async() => {
        if(!instance) return

        const balance = await instance.getLoadedBalance()
        setWalletBalance(parseFloat(ethers.utils.formatEther(balance.toString())))
    }, [instance])




    const handleSubmit = (values: { file: {}; }) => {
        createBundlrTx(values.file, values.file.type)
    }

    const [buffer, setBuffer] = React.useState(null)
    const [txId, setTxId] = React.useState(null)
    const [priceOfUpload, setPriceOfUpload] = React.useState(0)

    const getPrice = React.useCallback(async (files) => {
        try {
            const price = await instance.getPrice(files[0]?.size)
            setPriceOfUpload(parseFloat(ethers.utils.formatEther(price.toString())))
        } catch (err) {
            console.log('err', err)
        }

    }, [instance])

    const getBuffer = React.useCallback(async (file) => {
        const tags = [{name: "Content-Type", value: file.type}]
        const blob = new Blob([file], {type: file.type})

        let reader = new FileReader()
        reader.onload = async function(evt) {
            console.log(evt.target.result);
            setBuffer(evt.target.result)
        }
        reader.readAsArrayBuffer(blob)

    }, [instance])

    const createBundlrTx = async (data, value: string) => {
        try {
            await provider._ready()
            const tags = [{name: "Content-Type", value}]

            const ex = await execute(await instance, tags)
            setTxId(ex)

        } catch(err) {
            console.log('err', err)
        }
    }

    const execute = React.useCallback(async (instance: any, tags: any) => {
        if(!buffer) return

        const tx = instance.createTransaction(buffer, {tags: tags});
        await tx.sign();
        await tx.upload()
        return (await tx.upload()).data.id

    }, [buffer])

    const handleFund = React.useCallback(async(price) => {
        const amount = ethers.utils.parseEther(price.toString()).toString()
        const fund = await instance.fund(amount, 1.1)
        await getBalance

    }, [instance])

    /* styles */
    const button = "inline-flex self-start p-4 bg-slate-400 rounded-xl hover:bg-slate-500"

    // uploads
    //https://arweave.net/jUxBkBgjBSk7KCwuYjVrr-ByHWf8EMO7YK_kFtPvzAU
    //https://arweave.net/ouL0JHLPI83jh54LZt9YA8zKhbP1EdqIfkBM3iXxwng
    //https://arweave.net/y2zVLLIybgci6pwj7PPKA1bGTWESB_oHQAXRMxsvvB8
    //http://localhost:3000/upload


        return (
        <div>
            {!instance && (
                <button
                    type="button"
                    className={button}
                    onClick={async () => {
                        const instance = await bundlr
                        if(!!instance) {
                            await instance.ready()
                            await setInstance(instance)
                        }
                    }}
                >
                    Connect to Bundlr
                </button>
            )}


            {!!instance && (
                <div>
                    <div>
                        Bundlr Wallet Funded with: {walletBalance} MATIC
                    </div>
                    <div>
                        Price of Upload: {priceOfUpload} MATIC
                    </div>
                    {priceOfUpload - walletBalance > 0 ? <div>
                        <div>Funding Needed: {priceOfUpload - walletBalance}</div>
                        <button type="button" onClick={() => handleFund(priceOfUpload)}>
                            Fund
                        </button>

                    </div>: null}
                </div>
            )}

            {!!instance && (
                <div>
                    <div>Upload File</div>
                    <Formik
                        initialValues={{ file: {} }}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        {props => (
                            <form onSubmit={props.handleSubmit}>
                                <>
                                    <input
                                        name="file"
                                        type="file"
                                        onChange={(event) => {
                                            props.setFieldValue("file", event.currentTarget.files[0]);
                                            getPrice(event.currentTarget.files)
                                            getBuffer(event.currentTarget.files[0])
                                        }}
                                    />
                                    {priceOfUpload && walletBalance && (priceOfUpload - walletBalance <= 0) ? (
                                        <button type="submit">submit</button>
                                    ) : null}
                                    {!!txId ? <div>
                                        <a href={`https://arweave.net/${txId}`}>{`https://arweave.net/${txId}`}</a>
                                    </div> : null}
                                </>
                            </form>
                        )}
                    </Formik>
                </div>
            )}


        </div>
    )

}

export default Upload
