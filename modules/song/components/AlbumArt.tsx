import Image from 'next/image'
import { PlayButton } from './PlayButton'
import Link from 'next/link'
import React from 'react'
import { ReleaseProps } from 'data/query/typings'
import { ipfsGateway, slugify } from 'utils'

export const AlbumArt: React.FC<{ release: ReleaseProps }> = ({ release }) => {
  return (
    <div
      className={
        'flex justify-center mx-auto w-11/12 pt-20 sm:pt-28 pb-4 sm:pb-14 sm:w-4/5'
      }
    >
      <div className={'flex flex-col items-center gap-3 sm:gap-10 pt-12 sm:flex-row'}>
        {release?.metadata?.project.artwork.uri && (
          <div
            className={
              'relative min-w-[300px] min-h-[300px] sm:min-w-[300px] sm:min-h-[300px] md:min-w-[400px] md:min-h-[400px] border rounded-xl overflow-hidden'
            }
          >
            <Image
              layout="fill"
              src={ipfsGateway(release?.metadata?.project.artwork.uri)}
              alt={`Album cover for ${release?.name}`}
              priority
            />
          </div>
        )}
        <div
          className={
            'flex-col sm:flex-row flex items-center justify-center gap-2 sm:gap-5'
          }
        >
          <PlayButton release={release} />
          <div className={'flex flex-col max-w-[400px]'}>
            <div
              className={
                'cursor-pointer text-3xl sm:text-4xl font-bold hover:text-gray-700'
              }
            >
              {release?.metadata?.name}
            </div>
            {release?.metadata.artist && (
              <div className={'text-2xl sm:text-3xl'}>
                <Link href={`/${slugify(release?.metadata.artist)}`}>
                  {release?.metadata.artist}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
