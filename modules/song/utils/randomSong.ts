import { PlayerTrack, ReleaseProps } from 'data/query/typings'
import { ipfsGateway } from 'utils'

export const randomSong = (songs: ReleaseProps[]): PlayerTrack => {
  const random = (max: ReleaseProps[]) => Math.floor(Math.random() * max.length)
  const release = songs[random(songs)]

  return {
    artist: release?.metadata?.artist,
    image: ipfsGateway(release?.metadata?.project?.artwork.uri),
    audio: ipfsGateway(release?.metadata?.losslessAudio),
    title: release?.metadata?.title,
    trackNumber: release?.metadata?.trackNumber,
    release,
  }
}
