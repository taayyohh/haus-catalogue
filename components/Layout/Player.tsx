import React from "react"
import { usePlayerStore } from "../../stores/usePlayerStore"
import { BsFillPlayFill } from "react-icons/bs"
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"

const Player = () => {
  const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
  const [audioContext, setAudioContext] = React.useState(undefined)
  const handleQueue = React.useMemo(() => {
    console.log("q", queuedMusic)
  }, [queuedMusic])

  React.useEffect(() => {
    const audioContext = new AudioContext()

    // @ts-ignore
    setAudioContext(audioContext)
  }, [])

  const audioRef = React.useRef(null)

  const handlePlay = (audioContext: any) => {
    // check if context is in suspended state (autoplay policy)
    const track = audioContext.createMediaElementSource(audioRef.current)
    track.connect(audioContext.destination)

    if (audioContext.state === "suspended") {
      console.log("audi", audioContext)
      audioContext.resume()
    }

    console.log("tract", track)

    // if (audioContext.state === 'suspended') {
    //         audioContext.resume();
    //     }

    // // play or pause track depending on state
    // if (this.dataset.playing === 'false') {
    //     audioElement.play();
    //     this.dataset.playing = 'true';
    // } else if (this.dataset.playing === 'true') {
    //     audioElement.pause();
    //     this.dataset.playing = 'false';
    // }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full">
      {queuedMusic.length > 0 && (
        <>
          <div className="inline-flex items-center gap-2 self-start bg-rose-600 px-2">
            <BiSkipPrevious size={28} />
            <div onClick={() => handlePlay(audioContext)}>
              <BsFillPlayFill size={22} />
            </div>
            <BiSkipNext size={28} />
          </div>
          <audio src={queuedMusic?.[0]?.audio} ref={audioRef} />
        </>
      )}
    </div>
  )
}

export default Player
