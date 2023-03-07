import React from "react"
import PlayButton from "./PlayButton"
import Link from "next/link"
import Image from "next/image"
import {slugify} from "../../../../utils/slugify";

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
          {/*  src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://nftstorage.link/ipfs/")}*/}
          {/*  layout="fill"*/}
          {/*/>*/}
          <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://nftstorage.link/ipfs/")} />
        </Link>
      )}
      <PlayButton release={release} isHover={isHover} />
    </div>
  )
}

export default AlbumInner
