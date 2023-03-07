import React from "react"
import { motion } from "framer-motion"
import { BsFillPlayFill } from "react-icons/bs"
import { usePlayerStore } from "stores/usePlayerStore"
import { ReleaseProps } from "../../../../data/query/typings"
import { ipfsGateway } from "../../../../utils"

const PlayButton: React.FC<{ release: ReleaseProps; isHover: boolean }> = ({ release, isHover }) => {
  const { addToQueue, queuedMusic, media, isPlaying } = usePlayerStore((state: any) => state)
  const variants = {
    hidden: {
      y: "100%",
    },
    visible: {
      y: 0,
    },
  }

  return (
    <motion.div
      variants={variants}
      initial={"hidden"}
      animate={isHover ? "visible" : "hidden"}
      className={"absolute bottom-0 w-full bg-zinc-800"}
    >
      <BsFillPlayFill
        size={50}
        color={"white"}
        className={"cursor-pointer"}
        onClick={() => {
          console.log("is", isPlaying, media)

          if (media.src && media.src === ipfsGateway(release?.metadata.losslessAudio)) {
            isPlaying ? media.pause() : media.play()
            return
          }

          addToQueue(
            {
              artist: release?.metadata?.artist,
              image: ipfsGateway(release?.metadata?.project?.artwork.uri),
              audio: ipfsGateway(release?.metadata.losslessAudio),
              title: release?.name,
              trackNumber: release?.metadata?.trackNumber,
              release: release,
            },
            "play"
          )
        }}
      />
    </motion.div>
  )
}

export default PlayButton
