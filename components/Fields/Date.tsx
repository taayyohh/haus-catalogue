import React from "react"
import { FormikErrors, FormikProps } from "formik"
import flatpickr from "flatpickr"
import { defaultFieldsetStyle, defaultInputErrorStyle, defaultInputLabelStyle, defaultInputStyle } from "./styles.css"
import { Instance } from "flatpickr/dist/types/instance"

require("flatpickr/dist/themes/light.css")

interface DateProps {
  inputLabel: string
  formik: FormikProps<any>
  id: string
  errorMessage: string | FormikErrors<any> | string[] | undefined | FormikErrors<any>[]
  value: any
  placeholder?: string
  autoSubmit?: boolean
  submitCallback?: (values: any) => void
  parentValues?: any
}

const Date: React.FC<DateProps> = ({
  inputLabel,
  formik,
  id,
  errorMessage,
  autoSubmit,
  submitCallback,
  value,
  placeholder,
  parentValues,
}) => {
  const ref = React.useRef(null)

  /*
  
      init date picker
  
     */
  React.useEffect(() => {
    if (!ref.current) return

    flatpickr(ref.current, {
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr, instance) => handleDateSelect(selectedDates, dateStr, instance),
    })
  }, [ref.current])

  const handleDateSelect = React.useCallback(
    (_selectedDates: Date[], dateStr: string, _instance: Instance) => {
      formik.setFieldValue(id, dateStr)

      if (autoSubmit && formik) {
        formik.submitForm()
      }
    },
    [formik, submitCallback, autoSubmit]
  )

  /*
  
      handle init date
  
     */

  React.useEffect(() => {
    if (
      autoSubmit &&
      parentValues.length === 0 &&
      formik.values.founderAddress === "0x2ce8D64CB1d6aFCc6654d2C4AeA77068187A98b8"
    ) {
      formik.submitForm()
    }
  }, [])

  return (
    <div className={`mb-8 p-0 ${defaultFieldsetStyle}`}>
      {inputLabel && <label className={defaultInputLabelStyle}>{inputLabel}</label>}
      <input
        className={!!errorMessage ? defaultInputErrorStyle : defaultInputStyle}
        ref={ref}
        type={"text"}
        data-input={true}
        value={value || ""}
        placeholder={placeholder}
        readOnly={true}
      />
    </div>
  )
}

export default Date
