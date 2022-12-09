import React from "react"
import PlayButton from "./PlayButton"
import Link from "next/link"
import { slugify } from "utils/helpers"
import Image from "next/image"

const AlbumInner = ({ release }: any) => {
  const [isHover, setIsHover] = React.useState<boolean>(false)

  return (
    <div
      className={"relative cursor-pointer overflow-hidden rounded border"}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {release?.metadata?.artist && (
        <Link href={`${slugify(release?.metadata?.artist)}/${slugify(release?.name)}`}>
          {/*<Image*/}
          {/*  src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")}*/}
          {/*  layout="fill"*/}
          {/*/>*/}
          <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
        </Link>
      )}
      <PlayButton release={release} isHover={isHover} />
    </div>
  )
}

export default AlbumInner
