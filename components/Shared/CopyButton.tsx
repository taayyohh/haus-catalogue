import { CheckCircledIcon, CopyIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion"
import React from "react"

interface CopyButtonProps {
  title?: string
  text?: string
  all?: boolean
}

const CopyButton = ({ title, text, all }: CopyButtonProps) => {
  const [copied, setCopied] = React.useState<boolean>(false)
  const handleCopy = async (text: string) => {
    if (copied) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  // p: 'x1',
  //     backgroundColor: 'transparent',
  //     borderColor: 'transparent',
  //     borderRadius: 'round',
  //     borderStyle: 'solid',
  //     borderWidth: 'thin',
  //     cursor: 'pointer',
  return (
    <React.Fragment>
      {!copied ? (
        <div className={"pointer border border-transparent bg-transparent"} onClick={() => handleCopy(text as string)}>
          <CopyIcon color={"#B3B3B3"} />
        </div>
      ) : (
        <div className={"pointer border border-transparent bg-transparent"}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} exit={{ scale: 0 }}>
            <CheckCircledIcon color={"#00C853"} />
          </motion.div>
        </div>
      )}
    </React.Fragment>
  )
}

export default CopyButton
