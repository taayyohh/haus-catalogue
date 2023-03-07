import React, { useState } from 'react'
import { usePlayerStore } from 'stores/usePlayerStore'
import { hhmmss } from 'modules/player/utils'

interface CurrentTimeProps {
  media: HTMLAudioElement
}

export const CurrentTime: React.FC<CurrentTimeProps> = ({ media }) => {
  const {
    setCurrentMedia,
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    queue,
    currentPosition,
    setCurrentPosition,
    setCurrentTime,
    currentTime,
    queuedItem,
  } = usePlayerStore((state: any) => state)

  // media?.addEventListener('timeupdate', (event: any) => {
  //   setCurrentTime(hhmmss(Math.floor(media.currentTime).toString()))
  // })
  //
  // media?.addEventListener('playing', (event: any) => {
  //   setIsPlaying(true)
  //   setDuration(hhmmss(media.duration.toString()))
  // })

  return (
    <div className="hidden items-center gap-4 sm:visible sm:flex ">
      {currentTime && duration && (
        <div>
          <div className="inline-flex h-10 items-center gap-2 self-start rounded border bg-white p-2 shadow">
            {currentTime} / {duration}
          </div>
        </div>
      )}
    </div>
  )
}
