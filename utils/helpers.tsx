/**
 * Flattens Nested Object
 *
 * @params object
 * @returns object
 */
import _ from "lodash"
import { isAddress } from "ethers/lib/utils"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const flatten = (object: object) => {
  return Object.assign(
    {},
    ...(function _flatten(o: object): any[] {
      // @ts-ignore
      return [].concat(...Object.keys(o).map(k => (typeof o[k] === "object" ? _flatten(o[k]) : { [k]: o[k] })))
    })(object)
  )
}

/**
 * compare two nearly identical objects and return an array of changes values
 *
 * @param initialValues: object
 * @param values: object
 *
 * @returns []
 * */

export const compareAndReturn = (initialValues: {}, values: {}) => {
  const updates = Object.entries(initialValues).reduce((acc: {}[] = [], cv: any) => {
    const _field = cv[0]
    const _value = cv[1]
    let _values: any[] = Object.entries(values)
    const value = _values.filter(item => item[0] === _field)[0][1]

    if (!_.isEqual(_value, value)) {
      if (typeof value !== "object") {
        if (_value.toString() !== value.toString()) {
          acc.push({
            field: _field,
            value: value,
          })
        }
      } else {
        const initValueObject: any[] = Object.entries(_value)
        const valueObject: any[] = Object.entries(value)
        initValueObject.reduce((_acc: any[] = [], _cv: any[]) => {
          const _f = _cv[0]
          const _v = _cv[1].toString()
          const v = valueObject.filter(item => item[0] === _f)[0]?.[1].toString()

          if (!_.isEqual(_v, v)) {
            acc.push({
              field: _field,
              value: value,
            })
          }
        }, [])
      }
    }

    return acc
  }, [])

  return updates.filter(
    (object, index) => index === updates.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object))
  )
}

/**
 * Determines whether an object is empty or not.
 *
 * @param object
 * @returns {boolean}
 */
export const isEmpty = (object: {}) => {
  for (let key in object) {
    if (object.hasOwnProperty(key)) return false
  }
  return true
}

/**
 * Create snippet of wallet address or
 * return address if it is not a "address"
 * as defined by Ethers.
 *
 * @param addr
 * @returns {string || null}
 */

export const walletSnippet = (addr: string | number | undefined) => {
  if (!addr) {
    return ""
  }
  let _addr = addr.toString()

  return isAddress(_addr) ? _addr.substring(0, 5) + "..." + _addr.substring(_addr.length - 5, _addr.length) : _addr
}

/*

  covert time { days, hours, minutes, seconds } to seconds

*/
interface toSeconds {
  days?: number | string
  hours?: number | string
  minutes?: number | string
  seconds?: number | string
}

export const toSeconds = ({ days, hours, minutes, seconds }: toSeconds) => {
  let secs = 0

  if (!!days) {
    secs = secs + Number(days) * 24 * 60 * 60
  }

  if (!!hours) {
    secs = secs + Number(hours) * 60 * 60
  }

  if (!!minutes) {
    secs = secs + Number(minutes) * 60
  }

  if (!!seconds) {
    secs = secs + Number(seconds)
  }

  return secs
}

/*

  covert seconds to { days, hours, minutes }

*/
export const fromSeconds = (_seconds: number) => {
  let minutes = _seconds / 60
  let hours = minutes / 60
  let days = hours / 24
  let seconds = 0

  if (days >= 1) {
    const daysMod = days % 1
    days = days - daysMod

    if (daysMod > 0) {
      hours = daysMod * 24
      const hoursMod = hours % 1
      if (hoursMod > 0) {
        hours = hours - hoursMod
        minutes = Math.round(hoursMod * 60)
      } else if (hoursMod === 0) {
        return { days, hours, minutes: 0 }
      }
    } else if (daysMod === 0) {
      return { days, hours: 0, minutes: 0 }
    }
  } else if (hours >= 1) {
    const hoursMod = hours % 1
    if (hoursMod > 0) {
      days = 0
      hours = hours - hoursMod
      minutes = Math.round(hoursMod * 60)
    } else if (hoursMod === 0) {
      return { days: 0, hours, minutes: 0 }
    }
  } else {
    const minutesMod = minutes % 1
    seconds = Math.round(minutesMod * 60)
    minutes = minutes - minutesMod

    hours = hours >= 1 ? hours : 0
    days = days >= 1 ? days : 0
  }

  return { days, hours, minutes, seconds }
}

/**
 *
 * Slugify
 *
 */

export const slugify = (string: string | undefined) => {
  if (!string) return ''
  const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;"
  const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------"
  const p = new RegExp(a.split("").join("|"), "g")

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

/**
 *
 * Unslugify
 *
 */

export const unslugify = (slug: string) => {
  const result = slug.replace(/-/g, " ")
  return result.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}
