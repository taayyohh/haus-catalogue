import {
  defaultHelperTextStyle,
  defaultInputLabelStyle,
  defaultTextAreaErrorStyle,
  defaultTextAreaStyle,
} from "./styles.css"
import { FormikProps } from "formik"
import React, { ChangeEventHandler } from "react"

interface TextAreaProps {
  id: string
  value: string
  inputLabel: string
  onChange: ChangeEventHandler
  onBlur: ChangeEventHandler
  formik?: FormikProps<any>
  errorMessage?: any
  helperText?: string
  autoSubmit?: boolean
  placeholder?: string
  minHeight?: number
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  value,
  inputLabel,
  onChange,
  errorMessage,
  helperText,
  autoSubmit,
  formik,
  placeholder,
  minHeight,
}) => {
  const handleBlur = () => {
    if (autoSubmit && formik) {
      formik.submitForm()
    }
  }

  return (
    <div className={"flex flex-col pb-5"}>
      <label className={defaultInputLabelStyle}>{inputLabel}</label>
      <textarea
        id={id}
        onChange={onChange}
        onBlur={handleBlur}
        value={value}
        className={!!errorMessage ? defaultTextAreaErrorStyle : defaultTextAreaStyle}
        placeholder={placeholder}
        style={{ minHeight: minHeight || "none" }}
      />
      {!!helperText && helperText?.length > 0 ? <div className={defaultHelperTextStyle}>{helperText}</div> : null}
    </div>
  )
}

export default TextArea
