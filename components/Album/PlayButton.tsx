import React from "react"
import { motion } from "framer-motion"
import { BsFillPlayFill } from "react-icons/bs"
import { usePlayerStore } from "stores/usePlayerStore"

const PlayButton: React.FC<any> = ({ release, isHover }) => {
  const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
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
        onClick={() =>
          addToQueue([
            ...queuedMusic,
            {
              artist: release?.metadata?.artist,
              image: release?.metadata?.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/"),
              songs: [
                {
                  audio: [release?.metadata?.losslessAudio.replace("ipfs://", "https://ipfs.io/ipfs/")],
                  title: release?.metadata?.title,
                  trackNumber: release?.metadata?.trackNumber,
                },
              ],
            },
          ])
        }
      />
    </motion.div>
  )
}

export default PlayButton
