import React from "react"
import { QueueItem, usePlayerStore } from "stores/usePlayerStore"
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs"
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"
import Link from "next/link"
import { PlayerTrack } from "data/query/typings"
import { CurrentTime } from "./CurrentTime"
import { slugify } from "utils"


export const Player = () => {
  const audioRef = React.useRef<null | HTMLAudioElement>(null)
  const {
    media,
    setCurrentMedia,
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    queue,
    currentPosition,
    setCurrentPosition,
    queuedItem,
  } = usePlayerStore((state: any) => state)

  const handleQueueAndPlay = React.useCallback(
    async (track: PlayerTrack) => {
      if (!audioRef.current) return

      console.log('tr', track)

      // setCurrentMedia(audioRef.current)
      // try {
      //   await handlePlay(audioRef.current)
      //   setIsPlaying(true)
      // } catch (error) {
      //   setIsPlaying(false)
      //   console.log("err", error)
      // }
    },
    [audioRef, media, setCurrentMedia]
  )

  const handleQueueItem = (queuedItem: QueueItem) => {
    switch (queuedItem.type) {
      case "play":
        return handleQueueAndPlay(queuedItem.track)
      case "front":
        return null
      case "back":
        return null
    }
  }

  React.useEffect(() => {
    if (queue.length) handleQueueItem(queuedItem)
  }, [queue])

  // media.addEventListener("pause", (event: any) => {
  //   setIsPlaying(false)
  //
  //   if (media.ended) {
  //     // console.log("queue", queue)
  //     if (queue.length > 1) {
  //       handleNext()
  //     } else {
  //       setIsPlaying(false)
  //     }
  //   }
  // })

  const handlePlay = async (media: HTMLAudioElement) => {
    await media.play()
  }

  const handlePause = async () => {
    media.pause()
  }

  const handleNext = async () => {
    media.pause()
    setIsPlaying(false)
    setCurrentPosition(queue.length - 1 > currentPosition ? currentPosition + 1 : 0)
    // media.play()
    // setIsPlaying(true)
  }

  const handlePrev = async () => {
    media.pause()
    setIsPlaying(false)
    setCurrentPosition(currentPosition > 1 ? currentPosition - 1 : queue.length - 1)
    // media.play()
    // setIsPlaying(true)
  }

  return (
    <div className="fixed bottom-2 flex flex w-full items-center justify-between px-4">
      <div className="flex items-center gap-4 ">
        <div>
          <div className="inline-flex h-10 items-center gap-2 self-start rounded border bg-white p-2 shadow">
            <button type="button" onClick={queue.length > 0 ? () => handlePrev() : () => {}}>
              <BiSkipPrevious size={28} />
            </button>
            {(isPlaying && (
              <button type="button" onClick={queue.length > 0 ? () => handlePause() : () => {}}>
                <BsFillPauseFill size={22} />
              </button>
            )) || (
              <button type="button" onClick={queue.length > 0 ? () => handlePlay(media) : () => {}}>
                <BsFillPlayFill size={22} />
              </button>
            )}

            <button type="button" onClick={queue.length > 0 ? () => handleNext() : () => {}}>
              <BiSkipNext size={28} />
            </button>
          </div>
          <audio crossOrigin="anonymous" preload={"auto"} src={queue[currentPosition]?.track.audio} ref={audioRef} />
        </div>
        {isPlaying && (
          <div className="inline-flex h-10 items-center gap-2 self-start rounded border bg-white p-2 shadow">
            <div>
              <Link
                href={`/${slugify(queue[currentPosition]?.track.artist)}/${slugify(
                  queue[currentPosition]?.track.title
                )}`}
              >
                {queue[currentPosition]?.track.title}
              </Link>
            </div>
            <div className="text-[#081C15]">
              {" "}
              <Link href={`/${slugify(queue[currentPosition]?.track.artist)}`}>
                {queue[currentPosition]?.track.artist}
              </Link>
            </div>
          </div>
        )}
      </div>

      <CurrentTime media={media} />
    </div>
  )
}
