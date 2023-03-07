import FieldSwitch from "./FieldSwitch"
import { defaultFormButton, defaultFormStyleVariants } from "./styles.css"
import { Formik, FormikHelpers, FormikProps, FormikValues } from "formik"
import React, { ReactNode } from "react"
import { isEmpty } from "../../utils/isEmpty"

export interface FieldProps {
  name: string
  type: string
  inputLabel: string
  helperText?: string
}

export interface FormProps {
  fields: FieldProps[]
  initialValues: {}
  validationSchema?: {}
  buttonText?: string
  submitCallback: (values: FormikValues, formik?: FormikHelpers<{}>) => void
  options?: any[] | object
  validateOnBlur?: boolean
  children?: ReactNode
}

const Form: React.FC<FormProps> = ({
  fields,
  initialValues,
  validationSchema,
  buttonText,
  submitCallback,
  options,
  validateOnBlur = false,
  children,
}) => {
  const handleSubmit = async (values: FormikValues, formik?: FormikHelpers<{}>) => {
    submitCallback(values, formik)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      validateOnMount={true}
      validateOnBlur={validateOnBlur}
    >
      {formik => {
        return (
          <form onSubmit={formik.handleSubmit} className={defaultFormStyleVariants["default"]}>
            <div className={`w-full`}>
              {fields.map((f, i) => (
                <FieldSwitch key={i} formik={formik} field={f} options={options} submitCallback={submitCallback} />
              ))}
            </div>
            <div className={"flex"}>
              <button
                className={`cursor-pointer bg-gray-800 text-white hover:bg-gray-900 ${defaultFormButton}`}
                type={"submit"}
                disabled={!isEmpty(formik.errors)}
              >
                {buttonText || "Submit"}
              </button>
            </div>
            {children}
          </form>
        )
      }}
    </Formik>
  )
}

export default Form
