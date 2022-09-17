import { radioStyles } from "./styles.css"
import { FormikErrors, FormikProps } from "formik"
import React from "react"

interface RadioProps {
  inputLabel: string
  formik: FormikProps<any>
  id: string
  errorMessage: string | FormikErrors<any> | string[] | undefined | FormikErrors<any>[]
  placeholder?: string
  autoSubmit?: boolean
  submitCallback?: (values: any) => void
  options?: any
  value: any
}

const Radio: React.FC<RadioProps> = ({ inputLabel, formik, id, options, value }) => {
  const handleSelection = (key: number) => {
    formik.setFieldValue(id, key)
  }

  return (
    <div className={"mb-8 flex-col"}>
      {options &&
        options?.[id].map((option: string, key: number) => (
          <div
            key={key}
            className={`mt-4 h-16 w-full items-center justify-center border-2 ${
              radioStyles[value === key ? "active" : "default"]
            }`}
            onClick={() => handleSelection(key)}
          >
            {option}
          </div>
        ))}
    </div>
  )
}

export default Radio
