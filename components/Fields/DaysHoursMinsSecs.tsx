import {
  daysHoursMinsErrorMessage,
  daysHoursMinsInput,
  daysHoursMinsInputError,
  defaultFieldsetInnerStyle,
  defaultFieldsetStyle,
  defaultInputLabelStyle,
  permaInputPlaceHolderStyle,
} from "./styles.css"
import { FormikProps } from "formik"
import React, { ChangeEventHandler } from "react"

interface DaysHoursMinsProps {
  id: string
  value: any
  inputLabel: string
  onChange: ChangeEventHandler
  onBlur: ChangeEventHandler
  formik?: FormikProps<any>
  errorMessage?: any
  placeholder?: string[]
}

const DaysHoursMinsSecs: React.FC<DaysHoursMinsProps> = ({ inputLabel, formik, id, errorMessage, value }) => {
  const { days, hours, minutes, seconds } = value
  const handleChange = (e: any, type: string) => {
    if (!formik) return
    const value = e.target.value
    formik.setFieldValue(`${id}.${type}`, parseInt(value))
  }

  const daysHasError = React.useMemo(() => {
    return errorMessage?.days?.length > 0
  }, [errorMessage])

  const hoursHasError = React.useMemo(() => {
    return errorMessage?.hours?.length > 0
  }, [errorMessage])

  const minutesHasError = React.useMemo(() => {
    return errorMessage?.minutes?.length > 0
  }, [errorMessage])

  const secondsHasError = React.useMemo(() => {
    return errorMessage?.seconds?.length > 0
  }, [errorMessage])

  return (
    <div className={"mb-3 flex flex-col"}>
      <label className={defaultInputLabelStyle}>{inputLabel}</label>
      <div className={defaultFieldsetInnerStyle}>
        <fieldset className={`mb-8 ${defaultFieldsetStyle}`}>
          <div className={`absolute right-2 bottom-6 ${daysHoursMinsErrorMessage}`}>{errorMessage?.days}</div>
          <input
            placeholder={"[Days]"}
            className={daysHasError ? daysHoursMinsInputError : daysHoursMinsInput}
            type="number"
            onChange={e => handleChange(e, "days")}
            value={isNaN(days) ? "" : days}
            step={1}
            min={0}
          />
          {typeof days === "number" && (!!days || days >= 0) ? (
            <div className={`absolute ${permaInputPlaceHolderStyle}`}>[Days]</div>
          ) : null}
        </fieldset>
        <fieldset className={`mb-8 ${defaultFieldsetStyle}`}>
          <div className={`absolute right-2 bottom-6 ${daysHoursMinsErrorMessage}`}>{errorMessage?.hours}</div>
          <input
            placeholder={"[Hours]"}
            className={hoursHasError ? daysHoursMinsInputError : daysHoursMinsInput}
            type="number"
            onChange={e => handleChange(e, "hours")}
            value={isNaN(hours) ? "" : hours}
            step={1}
            min={0}
          />
          {typeof hours === "number" && (!!hours || hours >= 0) ? (
            <div className={`absolute ${permaInputPlaceHolderStyle}`}>[Hours]</div>
          ) : null}
        </fieldset>
        <fieldset className={`mb-8 ${defaultFieldsetStyle}`}>
          <div className={`absolute right-2 bottom-6 ${daysHoursMinsErrorMessage}`}>{errorMessage?.minutes}</div>
          <input
            placeholder={"[Minutes]"}
            className={minutesHasError ? daysHoursMinsInputError : daysHoursMinsInput}
            type="number"
            onChange={e => handleChange(e, "minutes")}
            value={isNaN(minutes) ? "" : minutes}
            step={1}
            min={0}
          />
          {typeof minutes === "number" && (!!minutes || minutes >= 0) ? (
            <div className={`absolute ${permaInputPlaceHolderStyle}`}>[Minutes]</div>
          ) : null}
        </fieldset>
        <fieldset className={`mb-8 ${defaultFieldsetStyle}`}>
          <div className={`absolute right-2 bottom-6 ${daysHoursMinsErrorMessage}`}>{errorMessage?.seconds}</div>
          <input
            placeholder={"[Seconds]"}
            className={secondsHasError ? daysHoursMinsInputError : daysHoursMinsInput}
            type="number"
            onChange={e => handleChange(e, "seconds")}
            value={isNaN(seconds) ? "" : seconds}
            step={1}
            min={0}
          />
          {typeof seconds === "number" && (!!seconds || seconds >= 0) ? (
            <div className={`absolute ${permaInputPlaceHolderStyle}`}>[Seconds]</div>
          ) : null}
        </fieldset>
      </div>
    </div>
  )
}

export default DaysHoursMinsSecs
