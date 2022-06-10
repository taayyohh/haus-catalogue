import React from 'react'
import {ethers} from "ethers"
import {Signer} from "@ethersproject/abstract-signer/src.ts/index";
import {useLayoutStore} from "../../stores/useLayoutStore";
import HAUS_ABI from "out/Catalogue.sol/HausCatalogue.json"

const Catalogue  = () => {
    const signer = useLayoutStore(state => state.signer)
    const catalogueContract = React.useMemo(async () => {
        if(!signer) return
        try {
            return new ethers.Contract(process.env.HAUS_CATALOGUE || '', HAUS_ABI.abi, signer)
        } catch (err) {
            console.log("err", err)
        }
    }, [signer])

    React.useMemo(async () => {
        console.log('c', await catalogueContract)

    }, [catalogueContract])



    return (
        <div>
            hii
        </div>
    )

}

export default Catalogue
