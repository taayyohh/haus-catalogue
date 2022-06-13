import React from 'react'
import {ethers} from "ethers"
import {useLayoutStore} from "../../stores/useLayoutStore";
import HAUS_ABI from "out/HausCatalogue.sol/HausCatalogue.json"
import Bundlr from '@bundlr-network/client';

const Catalogue  = () => {
    const signer = useLayoutStore((state: any) => state.signer)
    const provider = useLayoutStore((state: any) => state.provider)
    const abi = HAUS_ABI.abi

    const bundlr = new Bundlr(
        "https://devnet.bundlr.network",
        "ethereum",
        process.env.PRIVATE_KEY,
        {
            providerUrl: process.env.RPC_URL,
        }
    )

    // console.log('b', bundlr)
    /*   */
   const handleUpload = React.useMemo(async () => {
        if(!bundlr.address) return
        console.log('b', bundlr)
        // return bundlr

    }, [bundlr])




    const catalogueContract = React.useMemo(async () => {
        if(!signer) return
        try {
            return new ethers.Contract(process.env.HAUS_CATALOGUE || '', abi, signer)
        } catch (err) {
            console.log("err", err)
        }
    }, [signer])

    React.useMemo(async () => {
        const contract = await catalogueContract
        if(!contract) return
        console.log('c', await contract)

    }, [catalogueContract])



    return (
        <div>
            hii
        </div>
    )

}

export default Catalogue
