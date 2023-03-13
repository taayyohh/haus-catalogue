import {keyframes, style} from "@vanilla-extract/css";

const pendingColor = keyframes({
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
})

export const deployPendingButtonStyle = style({
    background:
        'linear-gradient(90deg, rgba(0,3,242,1) 0%, rgba(207,187,21,1) 31%, rgba(85,219,9,1) 52%, rgba(255,0,0,1) 91%);',
    animation: `${pendingColor} 12s ease infinite`,
    backgroundSize: '400% 400%',
})