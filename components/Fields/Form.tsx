import FieldSwitch from "./FieldSwitch"
import { defaultFormAdvancedWrapper, defaultFormButton, defaultFormStyleVariants } from "./styles.css"
import { CheckIcon } from "@radix-ui/react-icons"
import { Formik, FormikValues } from "formik"
import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import { adminStickySaveButton, adminStickySaveWrapper, confirmFormWrapper } from "styles/Admin.css"
import { deployCheckboxHelperText, deployCheckboxStyleVariants } from "styles/deploy.css"
import { compareAndReturn, isEmpty } from "utils/helpers"

interface FieldProps {
  name: string
  type: string
  inputLabel: string
  helperText?: string
}

interface FormProps {
  fields: FieldProps[]
  initialValues: {}
  advancedFields?: FieldProps[]
  advancedValues?: {}
  validationSchema?: {}
  buttonText?: string
  enableReinitialize?: boolean
  submitCallback: (updates: any, setHasConfirmed?: any, formik?: FormikValues) => void
  hasNext?: boolean
  stickySave?: boolean
  compareReturn?: boolean
  isSubForm?: boolean
  options?: any[] | object
  validateOnBlur?: boolean
  autoSubmit?: boolean
  innerStyle?: any
  parentValues?: any
}

const Form: React.FC<FormProps> = ({
  fields,
  initialValues,
  advancedFields,
  advancedValues,
  validationSchema,
  buttonText,
  enableReinitialize = true,
  submitCallback,
  hasNext,
  stickySave,
  compareReturn,
  isSubForm = false,
  options,
  validateOnBlur = false,
  autoSubmit = false,
  innerStyle,
  parentValues,
}) => {
  /*
      handle mouseDown
      occurs before blur
     */

  const mouseDownEvent = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
  }

  /*
  
      handle submit
  
     */
  const handleSubmit = async (_values: {}, initialValues: any, formik?: FormikValues) => {
    /*
    
          if createSectionTitle  - if form is apart of FormHandler and needs to progress sections
    
         */
    if (compareReturn) {
      /*
      
            if compareReturn  - if form only should submit changed values to callback
      
           */
      let updates = compareAndReturn(initialValues, _values)

      if (hasConfirmed.state !== true) {
        setHasConfirmed({ state: null, values: updates })
      } else {
        submitCallback(updates, setHasConfirmed, formik)
      }
    } else {
      submitCallback(_values, formik)
    }
  }

  /*
  
      if compareReturn is true, ask for confirmation of changed values
  
     */
  const [hasConfirmed, setHasConfirmed] = React.useState<{
    state: boolean | null
    values: {}[] | null
  }>({ state: false, values: null })
  const confirmVariants = {
    initial: {
      height: 0,
    },
    animate: {
      height: "auto",
    },
  }

  /*
  
      handle advanced values and toggle
  
     */
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState<boolean>(false)
  const advancedVariants = {
    init: {
      height: 0,
    },
    open: {
      height: "auto",
    },
  }

  return (
    <Formik
      initialValues={advancedValues ? { ...initialValues, ...advancedValues } : initialValues}
      validationSchema={validationSchema}
      onSubmit={(values: any, formik: FormikValues) => handleSubmit(values, initialValues, formik)}
      enableReinitialize={enableReinitialize}
      validateOnMount={true}
      validateOnBlur={validateOnBlur}
    >
      {formik => {
        const changes = hasConfirmed?.values?.length
        return (
          <form onSubmit={formik.handleSubmit} className={defaultFormStyleVariants[stickySave ? "sticky" : "default"]}>
            <div className={`${!!innerStyle ? innerStyle : ""} w-full`}>
              {fields.map((f, i) => (
                <FieldSwitch
                  key={i}
                  formik={formik}
                  field={f}
                  autoSubmit={hasNext || autoSubmit}
                  setHasConfirmed={setHasConfirmed}
                  hasConfirmed={hasConfirmed}
                  options={options}
                  submitCallback={submitCallback}
                  parentValues={parentValues}
                />
              ))}
            </div>
            <motion.div
              className={defaultFormAdvancedWrapper}
              variants={advancedVariants}
              initial={"init"}
              animate={isAdvancedOpen ? "open" : "init"}
            >
              {advancedFields &&
                advancedFields?.map((f, i) => (
                  <FieldSwitch
                    key={i}
                    formik={formik}
                    field={f}
                    autoSubmit={hasNext}
                    setHasConfirmed={setHasConfirmed}
                    hasConfirmed={hasConfirmed}
                    options={options}
                    submitCallback={submitCallback}
                  />
                ))}
            </motion.div>

            {!autoSubmit && (
              <div className={"flex"}>
                {(stickySave && (
                  <AnimatePresence>
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}>
                      <div
                        className={`fixed bottom-0 left-0 flex w-full flex-col items-center justify-center ${adminStickySaveWrapper}`}
                      >
                        {(hasConfirmed.state || hasConfirmed.state === null) && (
                          <motion.div
                            variants={confirmVariants}
                            initial={"initial"}
                            animate={hasConfirmed.state || hasConfirmed.state === null ? "animate" : "initial"}
                          >
                            <div className={`flex flex-col py-8 px-4 ${confirmFormWrapper}`}>
                              <div className={"items-center justify-center gap-4"}>
                                <div
                                  className={`flex items-center justify-center ${
                                    deployCheckboxStyleVariants[hasConfirmed.state ? "confirmed" : "default"]
                                  }`}
                                  onClick={() =>
                                    setHasConfirmed({
                                      ...hasConfirmed,
                                      state: !hasConfirmed.state,
                                    })
                                  }
                                >
                                  {hasConfirmed && <CheckIcon color={"#fff"} height={"22px"} width={"22px"} />}
                                </div>
                                <div className={`flex ${deployCheckboxHelperText}`}>
                                  <>
                                    [I confirm that I want to change {changes}{" "}
                                    {!!changes && changes > 1 ? "parameters" : "parameter"}, and understand that there
                                    will be {changes} {!!changes && changes > 1 ? "transactions" : "transaction"} I need
                                    to sign and pay gas for.]
                                  </>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <button
                          className={`my-3 bg-rose-400 ${adminStickySaveButton}`}
                          type={"submit"}
                          disabled={!formik.dirty || hasConfirmed.values?.length === 0 || formik.isSubmitting}
                        >
                          <>{hasConfirmed.state === true ? "Confirm" : "Save Changes"}</>
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )) || (
                  //TODO:: if its a formHandler form (i.e navigating between sections, we can abstract these "prev" and "next" buttons
                  <button
                    className={`bg-slate-900 text-rose-50 hover:bg-slate-800 hover:text-rose-100 ${defaultFormButton}`}
                    type={!isSubForm ? "submit" : "button"}
                    onClick={isSubForm ? () => handleSubmit(formik.values, formik.initialValues) : undefined}
                    disabled={!isEmpty(formik.errors)}
                    onMouseDown={mouseDownEvent}
                  >
                    {buttonText || "Submit"}
                  </button>
                )}
              </div>
            )}
          </form>
        )
      }}
    </Formik>
  )
}

export default Form
