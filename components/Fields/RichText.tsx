import { defaultHelperTextStyle, defaultInputLabelStyle } from "./styles.css"
import { RichTextEditor } from "@mantine/rte"
import { FormikProps } from "formik"
import React, { ChangeEventHandler } from "react"

interface RichTextProps {
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
}

const RichText: React.FC<RichTextProps> = ({
  id,
  value,
  inputLabel,
  errorMessage,
  helperText,
  autoSubmit,
  formik,
  placeholder,
}) => {
  const [editorValue, setEditorValue] = React.useState(value)
  const handleChange = (e: any) => {
    setEditorValue(e)
  }
  const handleBlur = () => {
    if (autoSubmit && formik) {
      formik.submitForm()
    }
  }

  const handleMouseLeave = () => {
    formik?.setFieldValue(id, editorValue)
  }

  React.useEffect(() => {
    setEditorValue(value)
  }, [value])

  return (
    <div className={"flex-col pb-5"}>
      <label className={defaultInputLabelStyle}>{inputLabel}</label>
      <RichTextEditor
        value={editorValue}
        onChange={handleChange}
        onMouseLeave={() => handleMouseLeave()}
        onBlur={handleBlur}
        style={{ minHeight: "250px" }}
        controls={[
          ["bold", "italic", "underline", "link"],
          ["unorderedList", "h1", "h2", "h3"],
        ]}
        placeholder={placeholder}
        sticky={false}
      />
      {!!helperText && helperText?.length > 0 ? <div className={defaultHelperTextStyle}>{helperText}</div> : null}
      {errorMessage && <>{errorMessage}</>}
    </div>
  )
}

export default RichText
