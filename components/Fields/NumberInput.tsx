import React, { InputHTMLAttributes, WheelEvent } from 'react'

import {
  defaultFieldsetStyle,
  errorMessageStyle,
  numberInputErrorStyle,
  numberInputStyle,
  placeholderStyle,
} from './styles.css'

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
  errorMessage?: string
  hasError?: boolean
  disableWheelEvent?: boolean
}

const NumberInput = ({
  label,
  className,
  errorMessage,
  hasError,
  value,
  disableWheelEvent = true,
  ...rest
}: NumberInputProps) => {
  return (
    <fieldset className={`${defaultFieldsetStyle} mb-8`}>
      {errorMessage && (
        <div className={`absolute right-2 bottom-6 ${errorMessageStyle}`}>
          {errorMessage}
        </div>
      )}
      <input
        {...rest}
        type="number"
        value={value}
        className={hasError ? numberInputErrorStyle : numberInputStyle}
        onWheel={
          disableWheelEvent
            ? (e: WheelEvent<HTMLInputElement>) => e.currentTarget.blur()
            : undefined
        }
      />

      {label && <div className={`${placeholderStyle} absolute`}>{label}</div>}
    </fieldset>
  )
}

export { NumberInput }
