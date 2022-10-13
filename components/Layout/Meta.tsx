import Head from "next/head"
import React from "react"

interface MetaProps {
  title: string
  type: string
  image: string
  slug: string
  description?: string
  duration?: string
  album?: string
  track?: string
  musician?: string
}

const Meta: React.FC<MetaProps> = ({ title, type, slug, image, description, duration, album, track, musician }) => {
  return (
    <Head>
      <title>LucidHaus | {title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={`https://lucid.haus${slug}`} />
      <meta property="og:image" content={image.replace("ipfs://", "https://ipfs.io/ipfs/")} />
      <meta property="og:description" content={description} />
      {type === "music.song" && (
        <>
          <meta property="music:duration" content={duration} />
          <meta property="music:album" content={album} />
          <meta property="music:album:track" content={track} />
          <meta property="music:musician" content={musician} />
        </>
      )}
    </Head>
  )
}

export default Meta
