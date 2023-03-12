import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode } from 'react'

export const FadeInOut: React.FC<{ children: ReactNode; k: any }> = ({ children, k }) => {
  return (
    <AnimatePresence exitBeforeEnter={true}>
      <motion.div
        key={k}
        variants={{
          closed: {
            y: 0,
            opacity: 0,
          },
          open: {
            y: 0,
            opacity: 1,
          },
        }}
        initial="closed"
        animate="open"
        exit="closed"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
