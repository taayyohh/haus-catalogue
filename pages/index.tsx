import Meta from 'components/Meta'
import { ReleaseProps } from 'data/query/typings'
import React from 'react'
import { usePlayerStore } from 'stores/usePlayerStore'
import { SWRConfig } from 'swr'

import { NowPlaying, SongGrid, randomSong } from 'modules/song'
import { getDiscography } from 'modules/song/utils/getDiscography'

import { ipfsGateway } from '../utils'

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
  const currentPosition = usePlayerStore((state) => state.currentPosition)
  const media = usePlayerStore((state) => state.media)

  /*  generate random song  */

  React.useEffect(() => {
    if (!discography || media) return

    const random = randomSong(discography)
    addToQueue(random, 'front')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Meta
        title={queue[currentPosition]?.track?.title}
        type={'music.song'}
        image={ipfsGateway(queue[currentPosition]?.track?.image)}
        slug={'/'}
        track={queue[currentPosition]?.track?.trackNumber}
        musician={queue[currentPosition]?.track?.artist}
      />
      {!!queue[currentPosition]?.track ? (
        <div className="absolute top-0 left-0 m-0 mx-auto box-border h-full w-screen min-w-0">
          <div className="m-0 mx-auto box-border w-screen min-w-0">
            <NowPlaying track={queue[currentPosition].track} />
            <SongGrid discography={discography} />
          </div>
        </div>
      ) : null}
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
