import React from 'react'
import { motion } from 'framer-motion'
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs'
import { PlayerState, usePlayerStore } from 'stores/usePlayerStore'
import { ReleaseProps } from 'data/query/typings'
import { ipfsGateway } from 'utils'

const PlayButton: React.FC<{ release: ReleaseProps; isHover: boolean }> = ({
  release,
  isHover,
}) => {
  const { addToQueue, media, isPlaying, setIsPlaying } = usePlayerStore(
    (state: PlayerState) => state
  )
  const variants = {
    hidden: {
      y: '100%',
    },
    visible: {
      y: 0,
    },
  }

  const handleClick = () => {
    if (media?.src === ipfsGateway(release?.metadata.losslessAudio)) {
      if (isPlaying) {
        media.pause()
        setIsPlaying(false)
      } else {
        media.play()
        setIsPlaying(true)
      }
    } else {
      addToQueue(
        {
          artist: release?.metadata?.artist,
          image: ipfsGateway(release?.metadata?.project?.artwork.uri),
          audio: ipfsGateway(release?.metadata.losslessAudio),
          title: release?.name,
          trackNumber: release?.metadata?.trackNumber,
          release: release,
        },
        'play'
      )
    }
  }

  return (
    <motion.div
      variants={variants}
      initial={'hidden'}
      animate={isHover ? 'visible' : 'hidden'}
      className={'absolute bottom-0 w-full bg-zinc-800'}
    >
      {(isPlaying && media?.src === ipfsGateway(release?.metadata.losslessAudio) && (
        <BsFillPauseFill
          size={50}
          color={'white'}
          className={'cursor-pointer'}
          onClick={handleClick}
        />
      )) || (
        <BsFillPlayFill
          size={50}
          color={'white'}
          className={'cursor-pointer'}
          onClick={handleClick}
        />
      )}
    </motion.div>
  )
}

export default PlayButton
