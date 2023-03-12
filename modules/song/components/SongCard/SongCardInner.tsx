import Link from 'next/link'
import React from 'react'

import { slugify } from '../../../../utils/slugify'
import PlayButton from './PlayButton'

const SongCardInner = ({ release }: any) => {
  const [isHover, setIsHover] = React.useState<boolean>(false)

  return (
    <div
      className={'relative cursor-pointer overflow-hidden rounded border'}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {release?.metadata?.artist && (
        <Link href={`${slugify(release?.metadata?.artist)}/${slugify(release?.name)}`}>
          {/*<Image*/}
          {/*  src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://nftstorage.link/ipfs/")}*/}
          {/*  layout="fill"*/}
          {/*/>*/}
          <img
            src={release?.metadata?.project?.artwork.uri.replace(
              'ipfs://',
              'https://nftstorage.link/ipfs/'
            )}
          />
        </Link>
      )}
      <PlayButton release={release} isHover={isHover} />
    </div>
  )
}

export default SongCardInner
