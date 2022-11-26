import React from "react"
import { GetServerSideProps } from "next"
import { slugify } from "utils/helpers"
import useSWR, { SWRConfig } from "swr"
import { AnimatePresence, motion } from "framer-motion"
import Album from "components/Album/Album"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"
import { getDiscography } from "utils/getDiscographyNullMetadata"

export const getServerSideProps: GetServerSideProps = async context => {
  const artist = context?.params?.artist as string

  try {
    //TODO:: write more specific call
    const { fallback, discography } = await getDiscography()
    const artistDiscography = discography?.reduce((acc: any[] = [], cv: any) => {
      if (slugify(cv.metadata.artist) === artist) acc.push(cv)

      return acc
    }, [])

    return {
      props: {
        artist,
        artistDiscography,
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

const Artist = ({ artist, discography }: any) => {
  const { data: _artist } = useSWR(`${artist}`, { revalidateOnFocus: false })
  const router = useRouter()
  const metadata =
    discography.find((release: { metadata: { artist_hero_preview: any } }) => release.metadata.artist_hero_preview)
      ?.metadata || discography[0].metadata

  return (
    <AnimatePresence>
      <motion.div
        variants={{
          closed: {
            y: 0,
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
        <div className={"fixed top-16 flex h-12 w-full items-center border-t-2  "}>
          <button onClick={() => router.back()}>
            <ChevronLeftIcon width={"28px"} height={"28px"} className={"ml-7 text-black"} />
          </button>
        </div>
        <div className={"mx-auto w-11/12 pt-32 sm:w-4/5"}>
          <div>
            {metadata?.artist_hero_preview && (
              <div className={"fixed left-0 top-0 -z-10 h-[100vh] w-full overflow-hidden"}>
                <img
                  src={metadata?.artist_hero_preview}
                  className={"h-full w-full object-cover"}
                  alt={"artist cover image"}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          {discography?.length > 0 ? (
            <div className="mx-auto mt-[40vh] h-full w-full rounded border-t bg-white sm:mt-[65vh] sm:h-[100vh]  sm:w-11/12">
              <div className={"mx-auto w-11/12"}>
                <div className={"py-12 text-center text-6xl font-bold uppercase text-black"}>
                  {metadata?.artist || metadata?.metadata?.artist}
                </div>
                <div className={"mx-auto mb-20 w-1/2"}>
                  <div className={"text-black"}>
                    {JSON.stringify(metadata?.artistBio)?.slice(1, -1).replace(/\\n/g, String.fromCharCode(13, 10))}
                  </div>
                </div>
                <div className=" grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-4">
                  {discography?.map((release: any, i: any) => (
                    <Album key={i} release={release} />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ArtistPage({ fallback, artist, artistDiscography, song }: any) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Artist artist={artist} song={song} discography={artistDiscography} />
    </SWRConfig>
  )
}
