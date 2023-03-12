import Head from 'next/head'
import React from 'react'

interface MetaProps {
  title: string
  type: string
  image: string
  slug: string
  description?: string
  duration?: string
  album?: string
  track?: number
  musician?: string
}

const Meta: React.FC<MetaProps> = ({
  title,
  type,
  slug,
  image,
  description,
  duration,
  album,
  track,
  musician,
}) => {
  return (
    <Head>
      <title>LucidHaus | {title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={`https://lucid.haus${slug}`} />
      <meta
        property="og:image"
        content={
          image ||
          'https://ipfs.io/ipfs/bafybeidhiby7h2vp4n36imehevfcxwvacipnd2ta7ya5tegkmduuk4emw4/lucidhaus-yellow.png'
        }
      />
      <meta property="og:description" content={description} />
      {type === 'music.song' && (
        <>
          <meta property="music:duration" content={duration} />
          <meta property="music:album" content={album} />
          <meta property="music:album:track" content={track?.toString()} />
          <meta property="music:musician" content={musician} />
        </>
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@lucidhaus" />
      <meta name="twitter:creator" content="@lucidahaus" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:url" content={`https://lucid.haus${slug}`} />
      <meta
        name="twitter:description"
        content={
          description || 'Lucidhaus is the home of timeless, post-genre black musicians.'
        }
      />
      <meta
        name="twitter:image"
        content={
          image ||
          'https://ipfs.io/ipfs/bafybeidhiby7h2vp4n36imehevfcxwvacipnd2ta7ya5tegkmduuk4emw4/lucidhaus-yellow.png'
        }
      />
    </Head>
  )
}

export default Meta
