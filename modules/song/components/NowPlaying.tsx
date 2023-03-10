import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { BsArrowDown, BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs'
import Link from 'next/link'
import { PlayerTrack } from 'data/query/typings'
import { usePlayerStore } from 'stores/usePlayerStore'
import { Bid } from 'modules/auction/components'
import { slugify } from 'utils'
import React from 'react'

export const NowPlaying: React.FC<{ track: PlayerTrack }> = ({ track }) => {
  const { isPlaying, media, duration, currentTime, addToQueue, setIsPlaying } =
    usePlayerStore()

  const handleClick = React.useCallback(() => {
    if (!!media && media.src) {
      if (isPlaying) {
        media.pause()
        setIsPlaying(false)
      } else {
        media.play()
        setIsPlaying(true)
      }
      return
    }
    addToQueue(track, 'play')
  }, [isPlaying, media])

  return (
    <div className="sticky top-0 z-0 grid h-screen w-screen place-items-center ">
      <div className="absolute -z-10 flex w-full max-w-screen-xl justify-center">
        {track && (
          <AnimatePresence exitBeforeEnter={true}>
            <motion.div
              className="relative flex flex-col items-center md:flex-row"
              key={track?.audio}
              variants={{
                closed: {
                  y: 10,
                  opacity: 0,
                },
                open: {
                  y: 0,
                  opacity: 1,
                },
              }}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div
                className={`sm-h-32 w-h-32 relative h-72 w-72 overflow-hidden rounded-full border sm:h-96 sm:min-h-[330px] sm:w-96 sm:min-w-[330px] cursor-pointer`}
                onClick={handleClick}
              >
                {track?.image && (
                  <Image
                    className={`h-full w-full ${isPlaying ? 'animate-spin-slow' : ''}`}
                    src={track?.image}
                    fill
                    priority
                    alt={`Cover Art for ${track.title}`}
                  />
                )}

                <div className="absolute top-[50%] left-[50%] -mt-[24px] -ml-[24px]">
                  {(isPlaying && <BsPauseCircleFill size={48} />) || (
                    <BsFillPlayCircleFill size={48} />
                  )}
                </div>
              </div>
              <div className="mt-4 flex max-w-[320px] flex-col gap-2 sm:max-w-[400px] md:ml-8 md:mt-0 md:gap-4 md:pl-8">
                <div className="text-3xl font-bold sm:text-4xl md:text-5xl">
                  <Link href={`${slugify(track?.artist)}/${slugify(track?.title)}`}>
                    {track?.title}
                  </Link>
                </div>
                <div className="text-3xl text-[#081C15] sm:text-4xl md:text-5xl">
                  <Link href={`${slugify(track?.artist)}`}>{track?.artist}</Link>
                </div>
                {currentTime && (
                  <div className="text-xl">
                    {currentTime} / {duration}
                  </div>
                )}
                <Bid release={track?.release} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="fixed bottom-5 animate-bounce">
        <BsArrowDown size={24} />
      </div>
    </div>
  )
}
