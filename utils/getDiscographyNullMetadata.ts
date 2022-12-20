import { discographyQuery } from "../query/discography"
import { slugify, ZERO_ADDRESS } from "./helpers"
import { HAUS_CATALOGUE_PROXY } from "../constants/addresses"

export async function getDiscographyNullMetadata(
  _discography: { metadata: string; tokenUrl: string; name: string; description: string; image: string }[]
) {
  const nullDiscography = _discography.filter((album: { metadata: {} }) => !album.metadata)
  const treatedAlbum = nullDiscography.map(
    async (album: { tokenUrl: string; metadata: {}; name: string; description: string; image: string }) => {
      const metadata = await Promise.all(
        [album.tokenUrl.replace("ipfs://", "https://nftstorage.link/ipfs/")].map(url => fetch(url))
      ).then(async res => {
        return Promise.all(res.map(async data => await data.json()))
      })
      album.metadata = metadata[0]
      album.name = metadata[0]?.name
      album.description = metadata[0]?.description
      album.image = metadata[0]?.imagePreviewUrl

      return album
    }
  )
  return await Promise.all(treatedAlbum)
}

export async function getDiscography() {
  const _discography = await discographyQuery()
  const filteredDiscography = _discography.filter(
    (album: { owner: string; metadata: { owner: string }; tokenUrl: string }) => {
      return (
        album.owner !== ZERO_ADDRESS &&
        !!album.metadata &&
        album.metadata.owner !== "0x2506d9f5a2b0e1a2619bcce01cd3e7c289a13163"
      )
    }
  )
  const treatedDiscography = await getDiscographyNullMetadata(_discography)
  const discography = [...treatedDiscography, ...filteredDiscography]
  const fallback = discography?.reduce((acc: any, cv: { name: string; metadata: { artist: string } }) => {
    if (!!cv.metadata.artist && !!cv.name) {
      acc = { ...acc, [`${slugify(cv.metadata.artist)}/${slugify(cv.name)}`]: cv }
    }

    return acc
  }, {})

  return {
    fallback,
    discography,
  }
}
