import React from "react"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers } from "ethers"
import HAUS_ABI from "ABI/HausCatalogue.json"
import { discographyQuery } from "query/discography"
import reserveAuctionABI from "@zoralabs/v3/dist/artifacts/ReserveAuctionCoreEth.sol/ReserveAuctionCoreEth.json"
import Album from "./Album"

const Discography: React.FC<any> = ({ discography }) => {
  const { signer } = useLayoutStore()
  const [contract, setContract] = React.useState<any>()

  React.useMemo(async () => {
    if (!signer) return


    try {
      const contract: any = new ethers.Contract(process.env.HAUS_CATALOGUE_PROXY || "", HAUS_ABI.abi, signer)
      const reserveAuction = new ethers.Contract(
        "0x2506d9f5a2b0e1a2619bcce01cd3e7c289a13163",
        reserveAuctionABI.abi,
        signer
      )
      // console.log("r", reserveAuction)

      setContract(contract)
    } catch (err) {
      console.log("err", err)
    }
  }, [signer, HAUS_ABI])

  const tokenMetadata = React.useMemo(() => {
    if (!contract || !discography) return

    const tokens = discography.tokens.nodes

    return tokens.reduce(async (acc: any, cv: { token: { tokenId: any } }) => {
      const accumulator = await acc

      const id = Number(cv.token.tokenId)
      const uri = await contract.tokenURI(id)

      accumulator.push({ uri: uri.replace("ipfs://", "https://ipfs.io/ipfs/"), token: cv.token })
      return accumulator
    }, [])
  }, [contract, discography])

  const _catalogue = React.useMemo(async () => {
    if (!tokenMetadata) return

    const jsonArray: any[] = await tokenMetadata
    return jsonArray.reduce(async (acc, cv) => {
      const accumulator = await acc

      const metadata = await Promise.all([cv.uri].map(uri => fetch(uri))).then(async res => {
        return Promise.all(res.map(async (data: { json: () => any }) => await data.json()))
      })

      accumulator.push({ metadata: metadata[0], token: cv.token })

      return accumulator
    }, [])
  }, [tokenMetadata])

  const [catalogue, setCatalogue] = React.useState<any[]>([])
  React.useMemo(async () => {
    const catalogue = await _catalogue

    console.log(catalogue)

    setCatalogue(catalogue)
  }, [_catalogue])

  return (
    <div>
      <div>hi</div>
      <div>discography</div>

      <div className="relative mx-auto flex w-full flex-col bg-rose-200 pb-24">
        {catalogue?.length > 0 ? (
          <div className="mx-auto w-11/12">
            <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-4">
              {catalogue?.map((release: any, i) => (
                <Album key={i} release={release.metadata} token={release.token} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Discography

export async function getServerSideProps() {
  try {
    // zora api queries
    const discography = await discographyQuery()
    return {
      props: {
        discography,
      },
    }
  } catch (error: any) {
    console.log("err", error)
    return {
      notFound: true,
    }
  }
}
