import React from "react"
import { ethers } from "ethers"
import { useLayoutStore } from "stores/useLayoutStore"
import { usePlayerStore } from "stores/usePlayerStore"
import { BsArrowDown, BsFillPlayCircleFill, BsPauseCircleFill, BsPlayCircle } from "react-icons/bs"
import { AnimatePresence, motion } from "framer-motion"
import HAUS_ABI from "ABI/HausCatalogue.json"

const Catalogue = () => {
  const { signer } = useLayoutStore()
  const { addToQueue, queuedMusic, queue, currentPosition, media, isPlaying, currentTime, duration, setIsPlaying } =
    usePlayerStore((state: any) => state)

  /* Initialize Catalogue from Arweave */
  const [catalogue, setCatalogue] = React.useState<any[]>([])
  const _catalogue = React.useMemo(async () => {
    const jsonArray = [
      "https://arweave.net/h6Sz9VUsEIvsAPpzi3BHAG8AfgiNnq9wUkI4gOCU1CY",
      "https://arweave.net/DttB642UC40s8c3Y7tY97KExyokVnaszx0TDmnDdcgo",
      "https://arweave.net/r-egbnh3oS0j-LGwfEE5HoOYRJ0IJjf3RSdXwwcmZq0",
      "https://arweave.net/h8YMlG1YPcN7MnknPx9KMq-nu9V0l5cGx1rrC3S3U7o",
      "https://arweave.net/nblCy6exIeGsw4tdrYiYHP8zal0GPRuw_vyK36rIXhU",
      "https://arweave.net/BDKy7iOnuYFJBcSajsKMzJhq9_H_pL5SAeFyo8xZG64",
      "https://arweave.net/bi5wFC9NU-yZd_aukD57ltTWkLJY9V6jh1-STot5jsc",
      "https://arweave.net/ZfUibWCOa4wyHM5sNlzmWyZZM-bDyMZfNfhkUxw9Bt8",
      "https://arweave.net/0Gu4YdlNxNPOsKii24YsRyocyM8XX1pO0u-uF8Pvr4g",
      "https://arweave.net/Bt0aFSeYr0LNyaCws_lIvzgB_7WXlV3TrwMmE2i7uM4",
      "https://arweave.net/MvtqmvvB4OF6FMkDkiwo54MHKhtzn3d0R5phjRdf2hI",
      "https://arweave.net/YqPfBAxZFWQkQHhalOESQS-7ICtJhKHJo44JI4a0pKE",
      "https://arweave.net/OuGT8Xc40aAyw75ZZasL5SD5pcRnFPu2zzMfqR8yLBI",
      "https://arweave.net/gPKYXXKMgL6WMcP4RPbzRUqu34fUdQcVn8IzkYBHEew",
      "https://arweave.net/3CVfOif9dy22Z9_d3lbIOv-LBcrq8YVfaUYMjjYk7wo",
      "https://arweave.net/oRgswUy6xs-W_TilmT58aLFoCSKsePSMmsMBW9-juo4",
      "https://arweave.net/2SuYfZ5Jve3LezNtz2MOYJ45YVBekS-JzmhLYyDG70E",
      "https://arweave.net/3fQ9vmRoQ357FOabl07_lW7xQj-cjng-Gm54SE6SkA8",
      "https://arweave.net/JVG3U2JkZzLQ65PyOKgD-yqFFBFQhIxgTkAFn3plfOY",
    ]

    return await Promise.all(jsonArray.map(url => fetch(url))).then(async res => {
      return Promise.all(res.map(async data => await data.json()))
    })
  }, [])
  React.useMemo(async () => {
    const catalogue = await _catalogue

    console.log("c", catalogue.length)

    setCatalogue(catalogue)
  }, [_catalogue])

  /*  generate random song  */
  const random = React.useMemo(() => {
    const releases = catalogue.reduce((acc = [], cv) => {
      let count = 0
      acc.push({ artist: cv.primaryArtist, songs: cv.songs, image: cv.image })

      count = count + cv.songs.length

      console.log("c", count)

      return acc
    }, [])

    const random = (max: []) => Math.floor(Math.random() * max.length)
    const randomRelease = releases[random(releases)]
    const randomSong = randomRelease?.songs[random(randomRelease?.songs)]
    return { artist: randomRelease?.artist, image: randomRelease?.image, songs: [randomSong] }
  }, [catalogue])

  const catalogueContract = React.useMemo(async () => {
    if (!signer) return

    try {
      return new ethers.Contract("0xb12e12c36414c5512B07239F0EdACc70facF5B9D" || "", HAUS_ABI.abi, signer)
    } catch (err) {
      console.log("err", err)
    }
  }, [signer, HAUS_ABI])

  //
  React.useMemo(async () => {
    const contract = await catalogueContract
    if (!contract) return

    const name = await contract.name
    console.log("name", name)
    console.log("c", await contract)
  }, [catalogueContract])

  interface Release {
    image: string
    songs: [{ title: string }]
    name: string
    primaryArtist: string
  }

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
                    <div className="text-3xl font-bold sm:text-4xl md:text-5xl">{queue[currentPosition]?.title}</div>
                    <div className="text-3xl text-rose-700 sm:text-4xl md:text-5xl">
                      {queue[currentPosition]?.artist}
                    </div>
                    {currentTime.length > 0 && duration.length > 0 && (
                      <div className="text-xl">
                        {currentTime} / {duration}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="fixed bottom-5 animate-bounce">
            <BsArrowDown size={24} />
          </div>
        </div>
        <div className="relative mx-auto flex w-full flex-col bg-rose-200 pb-24">
          {catalogue.length > 0 ? (
            <div className="mx-auto w-11/12">
              <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-4">
                {catalogue.map((release: Release) => (
                  <div
                    key={release.image}
                    className="flex w-full flex-col items-center"
                    onClick={() =>
                      addToQueue([
                        ...queuedMusic,
                        { artist: release.primaryArtist, image: release.image, songs: release.songs },
                      ])
                    }
                  >
                    <img src={release.image} />
                    <div className="flex w-full flex-col items-start py-2">
                      <div className="text-xl font-bold">{release.name}</div>
                      <div>{release.primaryArtist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Catalogue
