import { ReleaseProps } from "data/query/typings"
import { ipfsGateway } from "../../../utils/ipfsGateway"

export async function getReleaseNullMetadata(_discography: ReleaseProps[]): Promise<ReleaseProps[]> {
  const nullDiscography = _discography.filter((album: { metadata: {} }) => !album.metadata)
  const treatedAlbum = nullDiscography.map(async (album: ReleaseProps) => {
    const metadata = await Promise.all([ipfsGateway(album.tokenUrl)].map(url => fetch(url))).then(async res => {
      return Promise.all(res.map(async data => await data.json()))
    })
    album.metadata = metadata[0]
    album.name = metadata[0]?.name
    album.description = metadata[0]?.description
    album.image = metadata[0]?.image_preview

    return album
  })
  return await Promise.all(treatedAlbum)
}
