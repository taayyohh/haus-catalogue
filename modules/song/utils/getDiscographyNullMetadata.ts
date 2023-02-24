import { ReleaseProps } from "data/query/typings"

export async function getDiscographyNullMetadata(discography: ReleaseProps[]) {
  const nullDiscography = discography.filter((album: { metadata: {} }) => !album.metadata)
  const treatedAlbum = nullDiscography.map(async (album: ReleaseProps) => {
    const metadata = await Promise.all(
      [album.tokenUrl.replace("ipfs://", "https://ipfs.zora.co/ipfs/")].map(url => fetch(url))
    ).then(async res => {
      return Promise.all(res.map(async data => await data.json()))
    })
    album.metadata = metadata[0]
    album.name = metadata[0]?.name
    album.description = metadata[0]?.description
    album.image = metadata[0]?.imagePreviewUrl

    return album
  })
  return await Promise.all(treatedAlbum)
}
