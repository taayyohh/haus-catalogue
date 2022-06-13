import React from 'react'
import {ethers} from "ethers"
import {useLayoutStore} from "../../stores/useLayoutStore";
import {usePlayerStore} from "../../stores/usePlayerStore";

// import HAUS_ABI from "../../out/HausCatalogue.sol/HausCatalogue.json"
import Bundlr from '@bundlr-network/client';

const Catalogue  = () => {
    const signer = useLayoutStore((state: any) => state.signer)
    const provider = useLayoutStore((state: any) => state.provider)
    const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)


    /* Initialize Catalogue from Arweave */
    const [catalogue, setCatalogue] = React.useState([])
    const _catalogue = React.useMemo(async () => {
        const jsonArray = [
            'https://arweave.net/h6Sz9VUsEIvsAPpzi3BHAG8AfgiNnq9wUkI4gOCU1CY',
            'https://arweave.net/DttB642UC40s8c3Y7tY97KExyokVnaszx0TDmnDdcgo',
            'https://arweave.net/r-egbnh3oS0j-LGwfEE5HoOYRJ0IJjf3RSdXwwcmZq0',
            'https://arweave.net/h8YMlG1YPcN7MnknPx9KMq-nu9V0l5cGx1rrC3S3U7o',
            'https://arweave.net/nblCy6exIeGsw4tdrYiYHP8zal0GPRuw_vyK36rIXhU',
            'https://arweave.net/BDKy7iOnuYFJBcSajsKMzJhq9_H_pL5SAeFyo8xZG64',
            'https://arweave.net/bi5wFC9NU-yZd_aukD57ltTWkLJY9V6jh1-STot5jsc',
            'https://arweave.net/ZfUibWCOa4wyHM5sNlzmWyZZM-bDyMZfNfhkUxw9Bt8',
            'https://arweave.net/0Gu4YdlNxNPOsKii24YsRyocyM8XX1pO0u-uF8Pvr4g',
            'https://arweave.net/Bt0aFSeYr0LNyaCws_lIvzgB_7WXlV3TrwMmE2i7uM4',
            'https://arweave.net/MvtqmvvB4OF6FMkDkiwo54MHKhtzn3d0R5phjRdf2hI',
            'https://arweave.net/YqPfBAxZFWQkQHhalOESQS-7ICtJhKHJo44JI4a0pKE',
            'https://arweave.net/OuGT8Xc40aAyw75ZZasL5SD5pcRnFPu2zzMfqR8yLBI',
            'https://arweave.net/gPKYXXKMgL6WMcP4RPbzRUqu34fUdQcVn8IzkYBHEew',
            'https://arweave.net/3CVfOif9dy22Z9_d3lbIOv-LBcrq8YVfaUYMjjYk7wo',
            'https://arweave.net/oRgswUy6xs-W_TilmT58aLFoCSKsePSMmsMBW9-juo4',
            'https://arweave.net/2SuYfZ5Jve3LezNtz2MOYJ45YVBekS-JzmhLYyDG70E',
            'https://arweave.net/3fQ9vmRoQ357FOabl07_lW7xQj-cjng-Gm54SE6SkA8',
            'https://arweave.net/JVG3U2JkZzLQ65PyOKgD-yqFFBFQhIxgTkAFn3plfOY',
        ]

        return await Promise.all(jsonArray.map(url => fetch(url)))
            .then(async (res) => {
                return Promise.all(
                    res.map(async (data) => await data.json())
                )
            })

    }, [])
    React.useMemo(async () => {
        const catalogue = await _catalogue

        // @ts-ignore
        setCatalogue(catalogue)
    }, [_catalogue])




    // const catalogueContract = React.useMemo(async () => {
    //     if(!signer) return
    //     try {
    //         return new ethers.Contract(process.env.HAUS_CATALOGUE || '', HAUS_ABI.abi, signer)
    //     } catch (err) {
    //         console.log("err", err)
    //     }
    // }, [signer])
    //
    // React.useMemo(async () => {
    //     const contract = await catalogueContract
    //     if(!contract) return
    //     console.log('c', await contract)
    //
    // }, [catalogueContract])

    interface Release {
        image: string,
        songs: [],
        name: string
    }

    return (
        <div className="flex flex-col w-8/12 mx-auto">
            {catalogue.length > 0 ? (
                <div className="grid grid-cols-4 gap-8 py-8">
                    {catalogue.map((release: Release) => (
                        <div key={release.image} className="flex flex-col items-center w-full" onClick={() => addToQueue([...queuedMusic, ...release.songs])}>
                            <img src={release.image} />
                            <div>{release.name}</div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    )

}

export default Catalogue
