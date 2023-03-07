import React, { useState } from 'react'
import { usePlayerStore } from 'stores/usePlayerStore'
import { SWRConfig } from 'swr'
import { getDiscography } from 'modules/song/utils/getDiscography'
import Meta from 'components/Meta'
import { PlayerTrack, ReleaseProps } from 'data/query/typings'
import { ipfsGateway } from 'utils/ipfsGateway'
import { randomSong, SongGrid, NowPlaying } from 'modules/song'

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
    console.log('err', error)
    return {
      props: {
        fallback: [],
        discography: [],
      },
    }
  }
}

const Home: React.FC<{ discography: ReleaseProps[] }> = ({ discography }) => {
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const queue = usePlayerStore((state) => state.queue)

  /*  generate random song  */

  const [randomTrack, setRandomTrack] = useState<PlayerTrack | null>(null)
  React.useEffect(() => {
    if (!discography) return

    const random = randomSong(discography)
    setRandomTrack(random)
  }, [])

  return (
    <>
      {!!randomTrack && (
        <div className="absolute top-0 left-0 m-0 mx-auto box-border h-full w-screen min-w-0">
          <Meta
            title={randomTrack?.title}
            type={'music.song'}
            image={ipfsGateway(randomTrack?.image)}
            slug={'/'}
            track={randomTrack?.trackNumber}
            musician={randomTrack?.artist}
            description={'LucidHaus Catalogue <3'}
          />
          <div className="m-0 mx-auto box-border w-screen min-w-0">
            <NowPlaying track={queue[0]?.track || randomTrack} />
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
