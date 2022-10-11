import React from "react"
import { usePlayerStore } from "stores/usePlayerStore"
import { BsArrowDown, BsFillPlayCircleFill, BsPauseCircleFill, BsPlayCircle } from "react-icons/bs"
import { AnimatePresence, motion } from "framer-motion"
import Album from "components/Album/Album"
import { discographyQuery } from "query/discography"
import { slugify, ZERO_ADDRESS } from "utils/helpers"
import { SWRConfig } from "swr"
import Link from "next/link"

export async function getServerSideProps() {
  try {
    const _discography = await discographyQuery()
    const discography = _discography.filter((album: { owner: string; metadata: {} }) => {
      return album.owner !== ZERO_ADDRESS && !!album.metadata
    })
    const fallback = discography?.reduce((acc: any, cv: { name: string; metadata: { artist: string } }) => {
      if (!!cv.metadata.artist && !!cv.name) {
        acc = { ...acc, [`${slugify(cv.metadata.artist)}/${slugify(cv.name)}`]: cv }
      }

      return acc
    }, {})

    return {
      props: {
        fallback,
        discography,
      },
    }
  } catch (error: any) {
    console.log("err", error)
    return {
      notFound: true,
    }
  }
}

const Catalogue: React.FC<any> = ({ discography }) => {
  const { addToQueue, queuedMusic, queue, currentPosition, media, isPlaying, currentTime, duration, setIsPlaying } =
    usePlayerStore((state: any) => state)

  /*  generate random song  */
  const random = React.useMemo(() => {
    const random = (max: []) => Math.floor(Math.random() * max.length)
    const release = discography[random(discography)]
    return {
      artist: release?.metadata?.artist,
      image: release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/"),
      songs: [
        {
          audio: [release?.metadata?.losslessAudio.replace("ipfs://", "https://ipfs.io/ipfs/")],
          title: release?.metadata?.title,
          trackNumber: release?.metadata?.trackNumber,
        },
      ],
    }
  }, [discography])

  React.useEffect(() => {
    if (!random) return

    addToQueue([random])
  }, [random])

  return (
    <div className="absolute top-0 left-0 m-0 mx-auto box-border h-full w-screen min-w-0">
      <div className="m-0 mx-auto box-border w-screen min-w-0">
        <div className="sticky top-0 z-0 grid h-screen w-screen place-items-center bg-rose-200">
          <div className="absolute -z-10 flex w-full max-w-screen-xl justify-center">
            {queue && (
              <AnimatePresence exitBeforeEnter={true}>
                <motion.div
                  className="relative flex flex-col items-center md:flex-row"
                  key={queue[currentPosition]?.audio}
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
                  <button
                    type="button"
                    className={`sm-h-32 w-h-32 relative h-72 w-72 overflow-hidden rounded-full border sm:h-96 sm:min-h-[330px] sm:w-96 sm:min-w-[330px]`}
                    onClick={() => {
                      isPlaying ? media.pause() : media.play()
                    }}
                  >
                    <img
                      className={`h-full w-full ${isPlaying ? "animate-spin-slow" : ""}`}
                      src={queue[currentPosition]?.image}
                    />
                    <div className="absolute top-[50%] left-[50%] -mt-[24px] -ml-[24px]">
                      {(isPlaying && <BsPauseCircleFill size={48} />) || <BsFillPlayCircleFill size={48} />}
                    </div>
                  </button>
                  <div className="mt-4 flex max-w-[320px] flex-col gap-2 sm:max-w-[400px] md:ml-8 md:mt-0 md:gap-4 md:pl-8">
                    <div className="text-3xl font-bold sm:text-4xl md:text-5xl">
                      {!!queue[currentPosition]?.artist && !!queue[currentPosition]?.title && (
                        <Link
                          href={`${slugify(queue[currentPosition]?.artist)}/${slugify(queue[currentPosition]?.title)}`}
                        >
                          {queue[currentPosition]?.title}
                        </Link>
                      )}
                    </div>
                    {!!queue[currentPosition]?.artist && (
                      <div className="text-3xl text-rose-700 sm:text-4xl md:text-5xl">
                        <Link href={`${slugify(queue[currentPosition]?.artist)}`}>
                          {queue[currentPosition]?.artist}
                        </Link>
                      </div>
                    )}
                    {currentTime.length > 0 && duration.length > 0 && (
                      <div className="text-xl">
                        {currentTime} / {duration}
                      </div>
                    )}
                    {/*<Countdown countdownString={countdownString} />*/}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="fixed bottom-5 animate-bounce">
            <BsArrowDown size={24} />
          </div>
        </div>
        <div className="relative mx-auto flex w-full flex-col bg-rose-200">
          {discography?.length > 0 ? (
            <div className="mx-auto w-11/12">
              <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-4">
                {discography?.map((release: any, i: any) => (
                  <Album key={i} release={release} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function CataloguePage({ fallback, discography }: any) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Catalogue discography={discography} />
    </SWRConfig>
  )
}
