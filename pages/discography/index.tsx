import React from "react"
import { useLayoutStore } from "stores/useLayoutStore"
import { discographyQuery } from "query/discography"
import Album from "./Album"
import useHausCatalogue from "hooks/useHausCatalogue"

const Discography: React.FC<any> = ({ discography }) => {
  const { signer, provider } = useLayoutStore()
  console.log('d', discography)


  // console.log('s', signer, provider)
  // const { hausCatalogueContract } = useHausCatalogue()
  //
  // const tokenMetadata = React.useMemo(() => {
  //   if (!hausCatalogueContract || !discography) return
  //
  //   const tokens = discography.tokens.nodes
  //
  //   return tokens.reduce(async (acc: any, cv: { token: { tokenId: any } }) => {
  //     const accumulator = await acc
  //
  //     const id = Number(cv.token.tokenId)
  //     const uri = await hausCatalogueContract.tokenURI(id)
  //
  //     accumulator.push({ uri: uri.replace("ipfs://", "https://ipfs.io/ipfs/"), token: cv.token })
  //     return accumulator
  //   }, [])
  // }, [hausCatalogueContract, discography])
  //
  // const _catalogue = React.useMemo(async () => {
  //   if (!tokenMetadata) return
  //
  //   const jsonArray: any[] = await tokenMetadata
  //   return jsonArray.reduce(async (acc, cv) => {
  //     const accumulator = await acc
  //
  //     const metadata = await Promise.all([cv.uri].map(uri => fetch(uri))).then(async res => {
  //       return Promise.all(res.map(async (data: { json: () => any }) => await data.json()))
  //     })
  //
  //     accumulator.push({ metadata: metadata[0], token: cv.token })
  //
  //     return accumulator
  //   }, [])
  // }, [tokenMetadata])
  //
  // const [catalogue, setCatalogue] = React.useState<any[]>([])
  // React.useMemo(async () => {
  //   const catalogue = await _catalogue
  //
  //   setCatalogue(catalogue)
  // }, [_catalogue])

  console.log("meee")

  return (
    <div>
      <div>hi</div>
      <div>discography</div>

      <div className="relative mx-auto flex w-full flex-col bg-rose-200 py-24">
        {discography?.length > 0 ? (
          <div className="mx-auto w-11/12">
            <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-4">
              {discography?.map((release: any, i: any) => (
                <Album key={i} release={release} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Discography

export async function getStaticProps() {
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
