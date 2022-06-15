import React from "react"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs"
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"

const Player = () => {
  const audioRef = React.useRef(null)
  const { addToQueue, queuedMusic, media, setCurrentMedia, isPlaying, setIsPlaying } = usePlayerStore(
    (state: any) => state
  )
  const [queue, setQueue] = React.useState([])
  const [currentAudioSrc, setCurrentAudioSrc] = React.useState("")

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

  /* handle add to queue */
  const handleAddToQueue = React.useMemo(() => {
    return queuedMusic.reduce((acc = [], cv: any) => {
      const artist = cv.artist
      const image = cv.image
      return cv.songs.reduce((acc = [], cv: any) => {
        // @ts-ignore
        acc.push({ ...cv, artist, image })

        return acc
      }, [])
    }, [])
  }, [queuedMusic])

  React.useEffect(() => {
    // @ts-ignore
    setQueue([...queue, ...handleAddToQueue])
  }, [handleAddToQueue])

  React.useEffect(() => {
    // @ts-ignore
    const currentSrc = queue[0]?.audio
    if (!currentSrc) return

    loadMedia()
    setCurrentAudioSrc(currentSrc)
  }, [queue])

  const loadMedia = async () => {
    const media: Media = audioRef.current || {
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
    }
    setCurrentMedia(media)
  }

  const playNext = async () => {
    await setQueue(queue.slice(1))
    setIsPlaying(true)

    console.log("media", media)
  }

  const mediaListener = React.useMemo(() => {
    // console.log("ready state", media.readyState)
    // console.log("duration", media.duration)
    // console.log("current time", media.currentTime)
    // console.log("currentSrc", media.currentSrc)
    // console.log("buffered", media.buffered)
    // console.log("control list", media.controlsList)
    // console.log("ended", media.ended)
    // console.log("error", media.error)
    // console.log("network state", media.networkState)
    // console.log("seekable", media.seekable)
    // console.log("seeking", media.seeking)
    // console.log("textTracks", media.textTracks)
    // console.log("volume", media.volume)
    // console.log("muted", media.muted)
    // console.log("paused", media.paused)

    media.addEventListener("progress", (event: any) => {
      // console.log("progress", event)
    })

    media.addEventListener("play", (event: any) => {
      console.log("play", event)
      console.log("duration", media.duration)
      console.log("current time", Math.floor(media.currentTime))
    })

    media.addEventListener("pause", (event: any) => {
      console.log("pause", event)
      console.log("ended", media.ended)
      console.log('hiiii')
      // setIsPlaying(false)

      if (media.ended) {
        console.log("queue", queue)
        if (queue.length > 1) {
          playNext()
        }
      }
    })

    media.addEventListener("playing", (event: any) => {
      console.log("playing", event)
      setIsPlaying(true)
      console.log("current time", media.currentTime)

      // if(audioRef.current.readyState) {
      //   media.load()
      // }
    })

    media.addEventListener("timeupdate", (event: any) => {
      console.log("current time", media.currentTime)

      // if(audioRef.current.readyState) {
      //   media.load()
      // }
    })
  }, [media])

  const handlePlay = async () => {
    media.play()
  }

  const handlePause = async () => {
    media.pause()
  }

  // @ts-ignore
  return (
    <div className="fixed bottom-2 left-2 left-0 flex w-full items-center gap-2">
      <div>
        <div className="inline-flex h-10 items-center gap-2 self-start rounded border border-rose-500 bg-rose-400 p-2 shadow">
          <BiSkipPrevious size={28} />

          {(isPlaying && (
            <button type="button" onClick={queue.length > 0 ? () => handlePause() : () => {}}>
              <BsFillPauseFill size={22} />
            </button>
          )) || (
            <button type="button" onClick={queue.length > 0 ? () => handlePlay() : () => {}}>
              <BsFillPlayFill size={22} />
            </button>
          )}

          <BiSkipNext size={28} />
        </div>
        <audio crossOrigin="anonymous" preload={"auto"} src={currentAudioSrc} ref={audioRef} />
      </div>
      {media.currentSrc.length > 0 ? (
        <div className="inline-flex h-10 items-center gap-2 self-start rounded border border-rose-500 bg-rose-400 p-2 shadow">
          <div>{queue[0]?.artist}</div>
          <div>{queue[0]?.title}</div>
        </div>
      ) : null}
    </div>
  )
}

export default Player
