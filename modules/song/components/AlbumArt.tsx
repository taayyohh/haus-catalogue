import Image from "next/image"
import { PlayButton } from "./PlayButton"
import Link from "next/link"
import React from "react"
import { ReleaseProps } from "data/query/typings"
import { ipfsGateway } from "utils"
import {slugify} from "../../../utils/slugify";

export const AlbumArt: React.FC<{ release: ReleaseProps }> = ({ release }) => {
  return (
    <div className={"flex justify-center mx-auto w-11/12 pt-32 sm:w-4/5"}>
      <div className={"flex flex-col items-center gap-10 pt-12 sm:flex-row"}>
        {release?.metadata?.project.artwork.uri && (
          <Image
            // layout="fill"
            src={ipfsGateway(release?.metadata?.project.artwork.uri)}
            style={{ borderRadius: 10 }}
            alt={`Album cover for ${release?.name}`}
            width={450}
            height={450}
          />
        )}
        <div className={"w-[300px] flex items-center justify-center gap-5"} style={{ width: 350}}>
          <PlayButton release={release} />
          <div className={"flex flex-col"}>
            <div className={"cursor-pointer text-4xl font-bold hover:text-gray-700"}>{release?.metadata?.name}</div>
            {release?.metadata.artist && (
              <div className={"text-3xl"}>
                <Link href={`/${slugify(release?.metadata.artist)}`}>{release?.metadata.artist}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
