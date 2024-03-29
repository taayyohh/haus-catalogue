import { ChevronLeftIcon } from '@radix-ui/react-icons'
import Meta from 'components/Meta'
import { ReleaseProps } from 'data/query/typings'
import { AnimatePresence, motion } from 'framer-motion'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { SWRConfig } from 'swr'
import { slugify } from 'utils'

import { SongCard } from 'modules/song'
import { getDiscography } from 'modules/song'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const artist = context?.params?.artist as string
  const slug = context?.resolvedUrl

  try {
    //TODO:: write more specific call
    const { fallback, discography } = await getDiscography()

    // @ts-ignore
    const artistDiscography: ReleaseProps[] = discography?.reduce(
      (acc: ReleaseProps[] = [], cv: ReleaseProps) => {
        if (slugify(cv.metadata.artist) === artist) acc.push(cv)

        return acc
      },
      []
    )

    return {
      props: {
        artist,
        slug,
        artistDiscography,
        fallback,
        discography,
      },
    }
  } catch (error: any) {
    console.log('err', error)
    return {
      notFound: true,
    }
  }
}

const Artist = ({ discography, slug }: any) => {
  const router = useRouter()
  const metadata =
    discography.find(
      (release: { metadata: { artist_hero_preview: any } }) =>
        release.metadata.artist_hero_preview
    )?.metadata || discography[0].metadata

  return (
    <>
      <AnimatePresence>
        <motion.div
          key={metadata?.artist_hero_preview}
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
          <div className={'fixed top-16 flex h-12 w-full items-center border-t-2  '}>
            <button
              onClick={() => router.back()}
              className={'absolute left-7 rounded-full bg-[#ffffff78] p-1 hover:bg-white'}
            >
              <ChevronLeftIcon width={'22px'} height={'22px'} className={'text-black'} />
            </button>
          </div>
          <div className={'mx-auto w-11/12 pt-32 sm:w-4/5'}>
            <div>
              {metadata?.artist_hero_preview && (
                <div
                  className={'fixed left-0 top-0 -z-10 h-[100vh] w-full overflow-hidden'}
                >
                  <Image
                    src={metadata?.artist_hero_preview}
                    className={'-mt-12 sm:mt-0 h-full w-full object-cover'}
                    alt={'artist cover image'}
                    priority
                    fill
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            {discography?.length > 0 ? (
              <div className="mx-auto mt-[40vh] h-full w-full rounded border-t bg-white sm:mt-[65vh] sm:min-h-[100vh] sm:w-11/12">
                <div className={'mx-auto w-11/12'}>
                  <div
                    className={
                      'py-12 text-center text-6xl font-bold uppercase text-black'
                    }
                  >
                    {metadata?.artist || metadata?.metadata?.artist}
                  </div>
                  <div className={'mx-auto mb-20 w-11/12 sm:w-3/4 md:w-3/4 lg:w-1/2'}>
                    <div className={'text-black gap-3'}>
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        remarkPlugins={[remarkGfm]}
                      >
                        {metadata?.artistBio}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-4">
                    {discography?.map((release: any, i: any) => (
                      <SongCard key={i} release={release} />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
      <Meta
        title={metadata?.artist || metadata?.metadata?.artist}
        type={'website'}
        image={metadata?.artist_hero_uri?.track?.image?.replace(
          'ipfs://',
          'https://nftstorage.link/ipfs/'
        )}
        description={`Explore ${metadata?.artist}'s discography onchain.`}
        slug={slug}
      />
    </>
  )
}

export default function ArtistPage({ fallback, artistDiscography, song, slug }: any) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Artist song={song} discography={artistDiscography} slug={slug} />
    </SWRConfig>
  )
}
