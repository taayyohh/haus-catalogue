import { NUMBER, RICH_TEXT, SINGLE_AUDIO_UPLOAD, SINGLE_IMAGE_UPLOAD, TEXT } from "components/Fields/types"

export const metadataFields = [
  {
    name: "image",
    type: SINGLE_IMAGE_UPLOAD,
    inputLabel: "Cover Artwork",
  },
  {
    name: "losslessAudio",
    type: SINGLE_AUDIO_UPLOAD,
    inputLabel: "Song Audio",
  },
  {
    name: "artist",
    type: TEXT,
    inputLabel: "Artist Name",
  },
  {
    name: "name",
    type: TEXT,
    inputLabel: "Song Title",
  },
  {
    name: "albumTitle",
    type: TEXT,
    inputLabel: "Album Title",
  },
  {
    name: "trackNumber",
    type: NUMBER,
    inputLabel: "Track Number",
    step: 1,
    min: 1,
  },
  {
    name: "description",
    type: RICH_TEXT,
    inputLabel: "Song description",
  },
  {
    name: "genre",
    type: TEXT,
    inputLabel: "Genre",
  },
  {
    name: "external_url",
    type: TEXT,
    inputLabel: "External URL",
  },
  {
    name: "animation_url",
    type: TEXT,
    inputLabel: "Animation URL",
  },
]

export const metadataInitialValues = {
  animation_url: "",
  artist: "",
  attributes: {
    artist: "",
  },
  description: "",
  duration: "",
  external_url: "",
  image: "",
  losslessAudio: "",
  mimeType: "",
  name: "",
  project: {
    artwork: {
      uri: "",
      mimeType: "",
    },
    title: "",
    description: "",
  },
  title: "",
  trackNumber: "",
  version: "lucidhaus-0.0.1",
  contentHash: "",
}
