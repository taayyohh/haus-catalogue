export interface ReleaseProps {
  tokenId: string
  tokenUrl: string
  metadata: {
    animation_url: string
    artist: string
    attributes: { artist: string }
    description: string
    duration: number
    external_url: string
    losslessAudio: string
    mimeType: string
    name: string
    project: {
      artwork: {
        uri: string
      }
      title: string
      description: string
    }
    title: string
    trackNumber: number
    version: string
    contentHash: string
    albumTitle: string
    genre: string
    cid: string
    image: string
    owner: `0x${string}`
  }
  mintInfo: {
    originatorAddress: `0x${string}`
    toAddress: `0x${string}`
  }
  owner: `0x${string}`
  name: string
  lastRefreshTime: string
  description: string
  image: {
    url: string
    size: string
    mimeType: string
    mediaEncoding: {}
  }
  collectionName: string
  collectionAddress: `0x${string}`
}

export interface PlayerTrack {
  artist: string
  image: string
  audio: string
  title: string
  trackNumber: number
  release: ReleaseProps
}
