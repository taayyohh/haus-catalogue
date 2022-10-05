import React from "react"
import { GetServerSideProps } from "next"
import { discographyQuery } from "query/discography"
import { slugify } from "utils/helpers"
import useSWR, { SWRConfig } from "swr"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"
const ReactHtmlParser = require("react-html-parser").default

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
        <div
          className={
            "fixed relative top-16 flex hidden h-12 w-full items-center border-y-2 border-rose-100 bg-rose-200 sm:flex"
          }
        >
          <button onClick={() => router.back()} className={"absolute"}>
            <ChevronLeftIcon width={"28px"} height={"28px"} className={"ml-7 text-rose-100"} />
          </button>
          <div className={"mx-auto flex w-4/5 justify-between"}>
            <div>Auction has not been kicked off</div>
            <div className={"flex"}>
              <div>Reserve Price</div>
              <div>Place Bid</div>
            </div>
          </div>
        </div>
        <div className={"mx-auto w-4/5 pt-32"}>
          <div className={"flex items-center gap-10 pt-12"}>
            <div className={"h-[500px] min-h-[500px] w-[500px] min-w-[500px]"}>
              <img src={release?.metadata?.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
            </div>
            <div>

              <div className={'flex items-center justify-center'}>
                <div className={'h-[80px] w-[80px] min-h-[80px] min-w-[80px] border-2 border-rose-100 rounded-full mr-6'}>

                </div>
                <div className={"flex flex-col"}>
                  <div className={"text-4xl font-bold"}>{release?.metadata?.name}</div>
                  <div className={"text-3xl"}>
                    <Link href={`/${slugify(release.metadata.artist)}`}>{release.metadata.artist}</Link>
                  </div>
                </div>
              </div>


              {/*{console.log(release)}*/}
            </div>
          </div>
        </div>
        <div className={"mx-auto w-4/5 pt-16 pb-48"}>
          <div className={"border-b-2 border-rose-100 pb-2 text-2xl font-bold"}>Record Details</div>
          <div className={"pt-4"}>{ReactHtmlParser(release?.metadata?.description)}</div>
          <div className={"mt-6 flex gap-10"}>
            {console.log("release", release)}
            <div className={"flex flex-col text-xl"}>
              <div>Format</div>
              <div>{release?.metadata?.mimeType.replace("audio/", ".")}</div>
            </div>
            <div className={"flex flex-col text-xl"}>
              <div>Token ID</div>
              <div>{release?.tokenId}</div>
            </div>
          </div>
          <div className={"mt-12 grid grid-cols-[1fr,2fr] gap-10"}>
            <div>
              <div className={"text-2xl font-bold"}>Auction Info</div>
              <div className={"mt-2 rounded-xl border-2 border-rose-100 p-8"}>
                <div className={'flex flex-col'}>
                  <div>Reserve price</div>
                  <div>Creator share</div>
                  <div>Current owner</div>
                </div>

              </div>
            </div>
            <div>
              <div className={"text-2xl font-bold"}>Bid History</div>
              <div className={"mt-2 rounded-xl border-2 border-rose-100 p-8"}></div>
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
