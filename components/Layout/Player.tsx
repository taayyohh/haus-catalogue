import React from "react"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { BsFillPlayFill } from "react-icons/bs"
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"

const Player = () => {
  const audioRef = React.useRef(null)
  const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
  const [queue, setQueue] = React.useState([])
  const [currentAudioSrc, setCurrentAudioSrc] = React.useState('')
  const [media, setCurrentMedia] = React.useState({
    readyState: 0,
    duration: 0,
    currentTime: 0,
    currentSrc: '',
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
    addEventListener: (type: string, event: {}) => {},
    play: () => {}
  })

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
    if(!currentSrc) return

    if(currentAudioSrc?.length === 0) {
      loadMedia()
      setCurrentAudioSrc(currentSrc)
    } else {
      if(currentAudioSrc !== currentSrc) {

      }
    }
  }, [queue])


  const loadMedia = () => {
    const media: Media = audioRef.current || {
      readyState: 0,
      duration: 0,
      currentTime: 0,
      currentSrc: '',
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
      play: () => {}
    }
    setCurrentMedia(media)
  }

  const mediaListener = React.useMemo(() => {
    console.log("ready state", media.readyState)
    console.log("duration", media.duration)
    console.log("current time", media.currentTime)
    console.log("currentSrc", media.currentSrc)
    console.log("buffered", media.buffered)
    console.log("control list", media.controlsList)
    console.log("ended", media.ended)
    console.log("error", media.error)
    console.log("network state", media.networkState)
    console.log("seekable", media.seekable)
    console.log("seeking", media.seeking)
    console.log("textTracks", media.textTracks)
    console.log("volume", media.volume)
    console.log("muted", media.muted)
    console.log("paused", media.paused)

    media.addEventListener("progress", (event: any) => {
      console.log("progress", event)

    })

    media.addEventListener("play", (event: any) => {
      console.log("play", event)

    })

    media.addEventListener("pause", (event: any) => {
      console.log("pause", event)

    })

    media.addEventListener("playing", (event: any) => {
      console.log("playing", event)
      setIsPlaying(true)

      // if(audioRef.current.readyState) {
      //   media.load()
      // }
    })


  }, [media])



  const [isPlaying, setIsPlaying] = React.useState(false)



  const handlePlay = async () => {
    media.play()
  }

  return (
    <div className="fixed bottom-0 left-0 w-full">
      {queue.length > 0 && (
        <>
          <div className="inline-flex items-center gap-2 self-start bg-rose-600 px-2">
            <BiSkipPrevious size={28} />

            <div onClick={() => handlePlay()}>
              <BsFillPlayFill size={22} />
            </div>

            <BiSkipNext size={28} />
          </div>
          <audio crossOrigin="anonymous" preload={"auto"} src={currentAudioSrc} ref={audioRef} />
        </>
      )}
    </div>
  )
}

export default Player
