import { animatedModal, animatedModalContent, animatedModalTrigger } from "./styles.css"
import { AnimatePresence, motion } from "framer-motion"
import React, { ReactElement } from "react"
import { Portal } from "react-portal"

interface AnimatedModalProps {
  children: ReactElement
  open?: boolean
  close?: any
  size?: string
  trigger?: ReactElement
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({ children, open, close, size = "small", trigger }) => {
  const contentVariants = {
    initial: {
      y: 50,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const wrapperVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  }

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const handleClose = () => {
    close && typeof close === "function" && close()
    setIsOpen(false)
  }

  React.useEffect(() => {
    if (typeof close === "boolean") {
      if (close) {
        handleClose()
      }
    }
  }, [close, handleClose])

  return (
    <>
      {trigger &&
        React.cloneElement(trigger, {
          onClick: () => {
            setIsOpen(true)
          },
          className: animatedModalTrigger,
        })}
      <Portal>
        <AnimatePresence>
          {(isOpen || open) && (
            <motion.div
              variants={wrapperVariants}
              initial={"initial"}
              animate={"animate"}
              exit={"initial"}
              className={animatedModal}
              onClick={() => handleClose()}
            >
              <motion.div
                variants={contentVariants}
                initial={"initial"}
                animate={"animate"}
                exit={"initial"}
                onClick={e => e.stopPropagation()}
              >
                <div
                  className={`mx-auto flex flex-col ${
                    animatedModalContent[
                      size === "small" ? "small" : size === "large" ? "large" : size === "auto" ? "auto" : "small"
                    ]
                  }`}
                >
                  {children}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  )
}
export default AnimatedModal
