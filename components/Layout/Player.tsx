import React from "react"
import {usePlayerStore} from "../../stores/usePlayerStore"
import {BsFillPlayFill} from "react-icons/bs"
import {BiSkipNext, BiSkipPrevious} from "react-icons/bi"

const Player = () => {
  const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
  const [audioContext, setAudioContext] = React.useState(undefined)
  const[ queue, setQueue] = React.useState([])

  /* handle add to queue */
  const handleAddToQueue = React.useMemo(() => {
    return queuedMusic.reduce((acc = [], cv: any) => {
      const artist = cv.artist
      const image = cv.image
      return cv.songs.reduce((acc = [], cv: any) => {
        // @ts-ignore
        acc.push({...cv, artist, image})

        return acc
      }, [])
    }, [])
  }, [queuedMusic])

  React.useMemo(() => {
    // @ts-ignore
    setQueue([...queue, ...handleAddToQueue])

  }, [handleAddToQueue])



  React.useEffect(() => {
    const audioContext = new AudioContext()

    // @ts-ignore
    setAudioContext(audioContext)
  }, [])

  const audioRef = React.useRef(null)

  const handlePlay = async (audioContext: any, url: string) => {
    const media = audioRef.current


    media.addEventListener('progress', (event) => {
      console.log('event', event);
    });


    media.play()
  }

  return (
    <div className="fixed bottom-0 left-0 w-full">
      {queue.length > 0 && (
        <>
          <div className="inline-flex items-center gap-2 self-start bg-rose-600 px-2">
            <BiSkipPrevious size={28} />
            <div onClick={() => handlePlay(audioContext, queue?.[0]?.audio)}>
              <BsFillPlayFill size={22} />
            </div>
            <BiSkipNext size={28} />
          </div>
          <audio crossOrigin="anonymous" preload={'preload'} src={queue?.[0]?.audio} ref={audioRef} />
        </>
      )}
    </div>
  )
}

export default Player
