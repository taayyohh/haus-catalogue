import { create } from "zustand"
import { PlayerTrack } from "data/query/typings"

export type PlayerQueueType = "play" | "front" | "back"
export interface QueueItem {
  track: PlayerTrack
  type: PlayerQueueType
}

export interface PlayerState {
  queuedItem: QueueItem | null
  addToQueue: (track: PlayerTrack, type: PlayerQueueType) => void
  media: HTMLAudioElement | undefined
  setCurrentMedia: (media: HTMLAudioElement) => void
  isPlaying: boolean
  setIsPlaying: (is: boolean) => void
  duration: string
  setDuration: (duration: string) => void
  currentTime: string
  setCurrentTime: (duration: string) => void
  queue: QueueItem[]
  clearQueueItem: () => void
  currentPosition: number
  setCurrentPosition: (position: number) => void
}

export const usePlayerStore = create<PlayerState>(set => ({
  isPlaying: false,
  setIsPlaying: (is: boolean) => {
    set(state => ({
      isPlaying: is,
    }))
  },
  addToQueue: (track: PlayerTrack, type: PlayerQueueType) => {
    set(state => ({
      queue: [{ track, type }, ...state.queue],
      queuedItem: { track, type },
    }))
  },
  media: undefined,
  setCurrentMedia: (media: HTMLAudioElement) => set({ media }),
  duration: "",
  setDuration: duration => set({ duration }),
  currentTime: "",
  setCurrentTime: currentTime => set({ currentTime }),
  queue: [],
  queuedItem: null,
  clearQueueItem: () => set({ queuedItem: null }),
  currentPosition: 0,
  setCurrentPosition: currentPosition => set({ currentPosition }),
}))
