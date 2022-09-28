import { style, styleVariants } from "@vanilla-extract/css"

export const animatedModal = style({
  position: "fixed",
  background: "rgba(0, 0, 0, 0.17)",
  height: "100vh",
  top: 0,
  left: 0,
  width: "100vw",
  zIndex: "10",
})

export const animatedModalTrigger = style({
  selectors: {
    "&:hover": {
      cursor: "pointer",
    },
  },
})

export const defaultAnimatedModalContent = style({
  background: "#fff",
  maxWidth: "calc(100vw - 50px)",
  maxHeight: "calc(85vh - 50px)",
  overflowY: "scroll",
  height: "auto",
  zIndex: "11",
  "@media": {
    "screen and (max-width: 768px)": {
      width: "calc(100% - 50px)",
      maxHeight: "calc(90vh - 50px)",
      left: 25,
      top: 25,
    },
  },
})

export const smallAnimatedContent = style({
  position: "fixed",
  left: "50%",
  marginLeft: -448 / 2,
  width: 448,
  height: 270,
  top: 120,
  gap: 24,
  padding: 32,
  borderRadius: 12,
  "@media": {
    "screen and (max-width: 768px)": {
      width: "calc(100% - 50px)",
      left: 25,
      marginLeft: 0,
    },
  },
})

export const largeAnimatedContent = style({
  position: "fixed",
  left: "50%",
  marginLeft: -912 / 2,
  width: 912,
  top: 120,
  gap: 24,
  padding: 32,
  borderRadius: 0,
  "@media": {
    "screen and (max-width: 1000px)": {
      width: "calc(100% - 50px)",
      left: 25,
      marginLeft: 0,
    },
    "screen and (max-width: 768px)": {
      width: "calc(100% - 50px)",
      left: 25,
      marginLeft: 0,
    },
  },
})

export const animatedModalContent = styleVariants({
  small: [defaultAnimatedModalContent, smallAnimatedContent],
  large: [defaultAnimatedModalContent, largeAnimatedContent],
  auto: [defaultAnimatedModalContent, smallAnimatedContent, { marginLeft: -680 / 2, width: 680, height: "auto" }],
})
