import React from 'react'
import { PlayerState, QueueItem, usePlayerStore } from 'stores'
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs'
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi'
import Link from 'next/link'
import { PlayerTrack } from 'data/query/typings'
import { CurrentTime } from './CurrentTime'
import { slugify } from 'utils'
import { hhmmss } from '../utils'

export const Player = () => {
  const audioRef = React.useRef<null | HTMLAudioElement>(null)
  const {
    media,
    setCurrentMedia,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    setDuration,
    queue,
    currentPosition,
    setCurrentPosition,
    queuedItem,
  } = usePlayerStore((state: PlayerState) => state)

  const handleQueueAndPlay = React.useCallback(
    async (track: PlayerTrack) => {
      if (!audioRef.current) return

      setCurrentMedia(audioRef.current)
      try {
        await handlePlay()
      } catch (error) {
        setIsPlaying(false)
        console.log('err', error)
      }
    },
    [audioRef, media, setCurrentMedia]
  )

  const handleQueueFront = React.useCallback(async () => {
    if (!audioRef.current) return

    setCurrentMedia(audioRef.current)
  }, [audioRef, media, setCurrentMedia])

  const handleQueueItem = (queuedItem: QueueItem) => {
    switch (queuedItem.type) {
      case 'play':
        return handleQueueAndPlay(queuedItem.track)
      case 'front':
        return handleQueueFront()
      case 'back':
        return null
    }
  }

  React.useEffect(() => {
    if (queue.length && !!queuedItem) handleQueueItem(queuedItem)
  }, [queue, queuedItem])

  const handlePlay = async () => {
    await media?.play()
    setIsPlaying(true)
  }

  const handlePause = async () => {
    media?.pause()
    setIsPlaying(false)
  }

  const handleNext = async () => {
    media?.pause()
    setIsPlaying(false)
    setCurrentPosition(queue.length - 1 > currentPosition ? currentPosition + 1 : 0)
  }

  const handlePrev = async () => {
    media?.pause()
    setIsPlaying(false)
    setCurrentPosition(currentPosition > 1 ? currentPosition - 1 : queue.length - 1)
  }

  const handleTimeUpdate = () => {
    // @ts-ignore
    const time = hhmmss(Math.floor(media.currentTime).toString())
    setCurrentTime(time)
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  const handleOnDurationChange = () => {
    // @ts-ignore
    setDuration(hhmmss(media?.duration.toString()))
  }

  return (
    <div className="fixed bottom-2 flex flex w-full items-center justify-between px-4">
      <div className="flex items-center gap-4 ">
        <div>
          <div className="inline-flex h-10 items-center gap-2 self-start rounded border bg-white p-2 shadow">
            <button
              type="button"
              onClick={queue.length > 0 ? () => handlePrev() : () => {}}
            >
              <BiSkipPrevious size={28} />
            </button>
            {(isPlaying && (
              <button
                type="button"
                onClick={queue.length > 0 ? () => handlePause() : () => {}}
              >
                <BsFillPauseFill size={22} />
              </button>
            )) || (
              <button
                type="button"
                onClick={queue.length > 0 && media ? () => handlePlay() : () => {}}
              >
                <BsFillPlayFill size={22} />
              </button>
            )}

            <button
              type="button"
              onClick={queue.length > 0 ? () => handleNext() : () => {}}
            >
              <BiSkipNext size={28} />
            </button>
          </div>
          <audio
            crossOrigin="anonymous"
            preload={'auto'}
            src={queue[currentPosition]?.track.audio}
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onDurationChange={handleOnDurationChange}
          />
        </div>

        {queue[currentPosition]?.track.artist && queue[currentPosition]?.track.title && (
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
              <Link href={`/${slugify(queue[currentPosition]?.track.artist)}`}>
                {queue[currentPosition]?.track.artist}
              </Link>
            </div>
          </div>
        )}
      </div>

      <CurrentTime />
    </div>
  )
}
