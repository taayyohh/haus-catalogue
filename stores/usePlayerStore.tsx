import create from "zustand"

interface Media {
  readyState: number
  duration: number
  currentTime: number
  currentSrc: string
  buffered: object
  controlsList: object
  ended: boolean
  error: object
  networkState: number
  seekable: object
  seeking: boolean
  textTracks: object
  volume: number
  muted: boolean
  paused: boolean
  addEventListener: (type: string, event: object) => void
  play: () => void
  pause: () => void
}
interface PlayerState {
  queuedMusic: []
  addToQueue: (songs: []) => void
  media: Media
  setCurrentMedia: (media: Media) => void
  isPlaying: boolean
  setIsPlaying: (is: boolean) => void
}

export const usePlayerStore = create<PlayerState>(set => ({
  isPlaying: false,
  setIsPlaying: (is: boolean) => {
    set(state => ({
      isPlaying: is,
    }))
  },
  queuedMusic: [],
  addToQueue: (songs: []) => {
    set(state => ({
      queuedMusic: [...songs],
    }))
  },
  media: {
    readyState: 0,
    duration: 0,
    currentTime: 0,
    currentSrc: "",
    buffered: {},
    controlsList: {},
    ended: false,
    error: {},
    networkState: 0,
    seekable: {},
    seeking: false,
    textTracks: {},
    volume: 0,
    muted: false,
    paused: false,
    addEventListener: () => {},
    play: () => {},
    pause: () => {},
  },
  setCurrentMedia: (media: Media) => set({ media }),
}))
