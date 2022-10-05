import React from "react"
import { GetServerSideProps } from "next"
import { discographyQuery } from "query/discography"
import { slugify } from "utils/helpers"
import useSWR, { SWRConfig } from "swr"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"

export const getServerSideProps: GetServerSideProps = async context => {
  const artist = context?.params?.artist as string
  const song = context?.params?.song as string

  try {
    const discography = await discographyQuery()
    const fallback = discography?.reduce((acc: any, cv: { name: string; metadata: { artist: string } }) => {
      acc = { ...acc, [`${slugify(cv.metadata.artist)}/${slugify(cv.name)}`]: cv }

      return acc
    }, {})

    return {
      props: {
        artist,
        song,
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

const Song = ({ artist, song }: any) => {
  const { data: release } = useSWR(`${artist}/${song}`)
  const router = useRouter()

  return (
    <AnimatePresence exitBeforeEnter={true}>
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
        <div className={"fixed top-16 flex h-12 w-full items-center border-y-2 border-rose-100 bg-rose-200"}>
          <button onClick={() => router.back()}>
            <ChevronLeftIcon width={"28px"} height={"28px"} className={"ml-7 text-rose-100"} />
          </button>
        </div>
        <div className={"mx-auto w-4/5 pt-32"}>
          <div className={"flex items-center gap-10 pt-12"}>
            <div className={"h-[500px] min-h-[500px] w-[500px] min-w-[500px]"}>
              <img src={release?.metadata?.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
            </div>
            <div>
              <div className={"flex flex-col"}>
                <div className={"text-5xl"}>{release?.metadata?.name}</div>
                <div className={"text-2xl"}>
                  {" "}
                  <Link href={`/${slugify(release.metadata.artist)}`}>{release.metadata.artist}</Link>
                </div>
              </div>

              {/*{console.log(release)}*/}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function SongPage({ fallback, artist, song }: any) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Song artist={artist} song={song} />
    </SWRConfig>
  )
}
