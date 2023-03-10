import {
  MARKDOWN,
  NUMBER,
  SINGLE_AUDIO_UPLOAD,
  SINGLE_IMAGE_UPLOAD,
  TEXT,
} from 'components/Fields/types'

export const metadataFields = [
  {
    name: 'image',
    type: SINGLE_IMAGE_UPLOAD,
    inputLabel: 'Cover Artwork',
  },
  {
    name: 'losslessAudio',
    type: SINGLE_AUDIO_UPLOAD,
    inputLabel: 'Song Audio',
  },
  {
    name: 'name',
    type: TEXT,
    inputLabel: 'Song Title',
  },
  {
    name: 'albumTitle',
    type: TEXT,
    inputLabel: 'Album Title',
  },
  {
    name: 'trackNumber',
    type: NUMBER,
    inputLabel: 'Track Number',
    step: 1,
    min: 1,
  },
  {
    name: 'description',
    type: MARKDOWN,
    inputLabel: 'Song description',
  },
  {
    name: 'genre',
    type: TEXT,
    inputLabel: 'Genre',
  },
  {
    name: 'external_url',
    type: TEXT,
    inputLabel: 'External URL',
  },
  {
    name: 'animation_url',
    type: TEXT,
    inputLabel: 'Animation URL',
  },
  {
    name: 'artist',
    type: TEXT,
    inputLabel: 'Artist Name',
  },
  {
    name: 'artist_avatar',
    type: SINGLE_IMAGE_UPLOAD,
    inputLabel: 'Artist Avatar Image',
  },
  {
    name: 'artist_hero',
    type: SINGLE_IMAGE_UPLOAD,
    inputLabel: 'Artist Hero Image',
  },
  {
    name: 'artistWalletAddress',
    type: TEXT,
    inputLabel: 'Artist Wallet Address',
    isAddress: true,
  },
  {
    name: 'artistBio',
    type: MARKDOWN,
    inputLabel: 'Artist Biography',
  },
]

// Avatar
// Hero
// Name
// Ens
// Address
// Bio
// Twitter handle

export const metadataInitialValues = {
  animation_url: '',
  artist: '',
  attributes: {
    artist: '',
  },
  description: '',
  duration: '',
  external_url: '',
  image: '',
  artist_avatar: '',
  artist_hero: '',
  losslessAudio: '',
  mimeType: '',
  name: '',
  project: {
    artwork: {
      uri: '',
      mimeType: '',
    },
    title: '',
    description: '',
  },
  title: '',
  trackNumber: '',
  version: 'lucidhaus-0.0.1',
  contentHash: '',
}
