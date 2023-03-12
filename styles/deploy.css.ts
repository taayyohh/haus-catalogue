import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { defaultFormButtonWithPrev } from 'components/Fields/styles.css'

export const infoSectionStyle = style({
  display: 'flex',
  '@media': {
    '(max-width: 768px)': {
      paddingLeft: '5px',
      paddingRight: '5px',
    },
  },
})

export const infoSectionSubStyle = style({
  display: 'inline-flex',
  '@media': {
    '(max-width: 768px)': {
      paddingLeft: '5px',
      paddingRight: '5px',
    },
  },
})

export const infoSectionVariants = styleVariants({
  default: [infoSectionStyle],
  sub: [infoSectionSubStyle],
})

export const infoSectionValueWrapperStyle = style({
  width: '100%',
  fontSize: 18,
  lineHeight: '24px',
  overflow: 'scroll',
  '@media': {
    '(max-width: 1200px)': {
      fontSize: '16px',
    },
    '(max-width: 768px)': {
      fontSize: '14px',
    },
  },
})

export const infoSectionValueVariants = styleVariants({
  default: [infoSectionValueWrapperStyle],
  sub: [infoSectionValueWrapperStyle, { paddingLeft: 0 }],
})

export const copyAddressButtonStyle = style({
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

export const infoSectionLabelStyle = style({
  fontSize: 12,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  color: '#4D4D4D',
})

export const successHeadingStyle = style({
  fontWeight: 700,
})

export const infoSectionValueStyle = style({
  fontSize: 18,
})

export const infoSectionWrapper = style({
  display: 'flex',
  overflow: 'hidden',
  height: 0,
  width: '100%',
})

export const reviewSectionStyle = style({
  backgroundColor: '#F3F3F3',
  boxSizing: 'border-box',
  border: '1px solid #E2E3E8',
  selectors: {
    '&:hover': {
      cursor: 'pointer',
      borderColor: '#000',
    },
  },
  '@media': {
    '(max-width: 768px)': {
      padding: '10px',
    },
  },
})

export const reviewSectionStyleVariants = styleVariants({
  open: [reviewSectionStyle, { background: 'rgba(243, 243, 243, 0.5)' }],
  default: [reviewSectionStyle],
})

export const reviewSectionSubHeading = style({
  margin: 0,
  width: '100%',
  fontSize: 23,
  fontWeight: 700,
  borderRadius: '16px',
  backgroundColor: '#F3F3F3',
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

const pendingColor = keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0% 50%' },
})

const deployPendingButtonStyle = style({
  background:
    'linear-gradient(90deg, rgba(0,3,242,1) 0%, rgba(207,187,21,1) 31%, rgba(85,219,9,1) 52%, rgba(255,0,0,1) 91%);',
  animation: `${pendingColor} 12s ease infinite`,
  backgroundSize: '400% 400%',
})

export const deployContractButtonStyle = styleVariants({
  pending: [defaultFormButtonWithPrev, deployPendingButtonStyle],
  default: [defaultFormButtonWithPrev],
  defaultFull: [defaultFormButtonWithPrev, { width: '100%' }],
  pendingFull: [defaultFormButtonWithPrev, deployPendingButtonStyle, { width: '100%' }],
})

export const deployCheckboxWrapperStyle = style({
  borderRadius: '16px',
  border: `1px solid #F2F2F2`,
})

export const deployCheckboxStyle = style({
  minHeight: 26,
  height: 26,
  width: 26,
  minWidth: 26,
  border: `1px solid #000`,
  borderRadius: '5px',
  selectors: {
    '&:hover': { cursor: 'pointer', background: '#000' },
  },
})

export const deployCheckboxStyleVariants = styleVariants({
  default: [deployCheckboxStyle],
  confirmed: [deployCheckboxStyle, { background: '#000' }],
})

export const deployCheckboxHelperText = style([
  {
    display: 'inline',
    lineHeight: '24px',
    color: '#808080',
  },
])
