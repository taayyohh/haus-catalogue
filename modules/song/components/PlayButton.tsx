import { ipfsGateway } from 'utils'
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs'
import React from 'react'
import { ReleaseProps } from 'data/query/typings'
import { usePlayerStore } from 'stores/usePlayerStore'

export const PlayButton: React.FC<{ release: ReleaseProps }> = ({ release }) => {
  const { isPlaying, addToQueue, media, queue, setIsPlaying } = usePlayerStore()

  const handleClick = React.useCallback(
    (release: ReleaseProps) => {
      if (!release.metadata.project.artwork.uri || !release.metadata.losslessAudio) {
        return
      }

      if (media?.src === ipfsGateway(release?.metadata?.losslessAudio)) {
        if (isPlaying) {
          media.pause()
          setIsPlaying(false)
        } else {
          media.play()
          setIsPlaying(true)
        }
        return
      }

      addToQueue(
        {
          artist: release.metadata.artist,
          image: ipfsGateway(release.metadata.project.artwork.uri),
          audio: ipfsGateway(release.metadata.losslessAudio),
          title: release.metadata.title,
          trackNumber: release.metadata.trackNumber,
          release,
        },
        'play'
      )
    },
    [release, media, addToQueue, isPlaying, queue]
  )

  return (
    <div
      className={
        'flex h-[80px] min-h-[80px] w-[80px] min-w-[80px] sm:h-[120px] sm:min-h-[120px] sm:w-[120px] sm:min-w-[120px] items-center justify-center rounded-full '
      }
    >
      <button type="button" onClick={() => handleClick(release)}>
        {(isPlaying && media?.src === ipfsGateway(release?.metadata?.losslessAudio) && (
          <BsFillPauseFill size={44} />
        )) || <BsFillPlayFill size={44} />}
      </button>
    </div>
  )
}
