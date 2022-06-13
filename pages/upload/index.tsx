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

    const handleSubmit = (values: { file: {}; }) => {
        createBundlrTx(values.file, values.file.type)
    }

    const [buffer, setBuffer] = React.useState(null)
    const createBundlrTx = async (data, value: string) => {
        try {
            const bundlrInstance = await bundlr
            if(!bundlrInstance) return

            await bundlrInstance.ready()
            await provider._ready()
            console.log('add', bundlrInstance.address)

            const tags = [{name: "Content-Type", value}]
            const blob = new Blob([data], {type: data.type})
            // const localURL = URL.createObjectURL(data)

            let reader = new FileReader()
            reader.onload = async function(evt) {
                console.log(evt.target.result);
                setBuffer(evt.target.result)
            }
            reader.readAsArrayBuffer(blob)

            const price = await bundlrInstance.getPrice(data.size)
            const balance = await bundlrInstance.getLoadedBalance()
            console.log('ba', balance)
            if (price.isGreaterThan(balance)) {
                const fund = await bundlrInstance.fund((parseFloat(ethers.utils.formatEther(price.toString())) * 2) * 10 ** 18, 1.1)
                console.log('fund', fund)
            }
           const ex = await execute(await bundlrInstance, tags)

        } catch(err) {
            console.log('err', err)
        }
    }

    const execute = React.useCallback(async (bundlrInstance: any, tags: any) => {
        if(!buffer) return

        console.log('b', bundlrInstance, tags, buffer)

        const tx = bundlrInstance.createTransaction(buffer, {tags: tags});
        await tx.sign();
        await tx.upload()
        const id = (await tx.upload()).data.id
        console.log('tx', tx, id)

        return id

    }, [buffer])


    return (
        <div>
            hi
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
                                }}
                            />
                            <button type="submit">submit</button>
                        </>
                    </form>
                )}
            </Formik>
        </div>
    )

}

export default Upload
