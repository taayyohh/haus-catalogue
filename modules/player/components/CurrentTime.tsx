import React from 'react'
import { PlayerState, usePlayerStore } from 'stores/usePlayerStore'

export const CurrentTime = () => {
  const duration = usePlayerStore((state: PlayerState) => state.duration)
  const currentTime = usePlayerStore((state: PlayerState) => state.currentTime)

  return (
    <div className="hidden items-center gap-4 sm:visible sm:flex ">
      {currentTime && (
        <div>
          <div className="inline-flex h-10 items-center gap-2 self-start rounded border bg-white p-2 shadow">
            {currentTime} / {duration}
          </div>
        </div>
      )}
    </div>
  )
}
