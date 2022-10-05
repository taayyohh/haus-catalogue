import React from "react"
import { GetServerSideProps } from "next"
import { discographyQuery } from "query/discography"
import { slugify } from "utils/helpers"
import useSWR, { SWRConfig } from "swr"
import { AnimatePresence, motion } from "framer-motion"
import Album from "components/Album/Album"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"

export const getServerSideProps: GetServerSideProps = async context => {
  const artist = context?.params?.artist as string

  try {
    const discography = await discographyQuery()
    const artistDiscography = discography?.reduce((acc: any[] = [], cv: any) => {
      if (slugify(cv.metadata.artist) === artist) acc.push(cv)

      return acc
    }, [])
    const fallback = discography?.reduce((acc: any, cv: { name: string; metadata: { artist: string } }) => {
      acc = { ...acc, [`${slugify(cv.metadata.artist)}/${slugify(cv.name)}`]: cv }

      return acc
    }, {})

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
  const { data: release } = useSWR(`${artist}`)
  const router = useRouter()

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
        <div className={"fixed top-16 flex h-12 w-full items-center border-t-2 border-rose-100 bg-rose-200"}>
          <button onClick={() => router.back()}>
            <ChevronLeftIcon width={"28px"} height={"28px"} className={"ml-7 text-rose-100"} />
          </button>
        </div>
        <div className={"mx-auto w-4/5 pt-32"}>
          <div className={"flex items-center gap-10 pt-12"}>
            <div>{/*{console.log(release)}*/}</div>
          </div>
        </div>
        <div>
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
