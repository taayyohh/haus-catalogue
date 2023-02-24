import React from "react"
import { usePlayerStore } from "stores/usePlayerStore"
import { SWRConfig } from "swr"
import { getDiscography } from "utils/getDiscographyNullMetadata"
import Meta from "components/Layout/Meta"
import { ReleaseProps } from "data/query/typings"
import { ipfsGateway } from "utils/ipfsGateway"
import { randomSong, SongGrid, NowPlaying } from "modules/song"

export async function getServerSideProps() {
  try {
    const { fallback, discography } = await getDiscography()

    return {
      props: {
        fallback,
        discography,
      },
    }
  } catch (error) {
    console.log("err", error)
    return {
      notFound: true,
    }
  }
}

const Home: React.FC<{ discography: ReleaseProps[] }> = ({ discography }) => {
  const addToQueue = usePlayerStore(state => state.addToQueue)
  const queue = usePlayerStore(state => state.queue)

  /*  generate random song  */

  React.useEffect(() => {
    const random = randomSong(discography)

    addToQueue(random)
  }, [])

  return (
    <>
      {!!queue[0] && (
        <div className="absolute top-0 left-0 m-0 mx-auto box-border h-full w-screen min-w-0">
          <Meta
            title={queue[0]?.title}
            type={"music.song"}
            image={ipfsGateway(queue[0]?.image)}
            slug={"/"}
            track={queue[0]?.trackNumber}
            musician={queue[0]?.artist}
            description={"LucidHaus Catalogue <3"}
          />
          <div className="m-0 mx-auto box-border w-screen">
            <NowPlaying track={queue[0]} />
            <SongGrid discography={discography} />
          </div>
        </div>
      )}
    </>
  )
}

export default function CataloguePage({ fallback, discography }: any) {
  return (
    <SWRConfig value={{ fallback }}>
      <Home discography={discography} />
    </SWRConfig>
  )
}
