/**
 * Flattens Nested Object
 *
 * @params object
 * @returns object
 */
import _ from "lodash";
import {isAddress} from "ethers/lib/utils";

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
        const value = _values.filter((item) => item[0] === _field)[0][1]

        if (!_.isEqual(_value, value)) {
            if (typeof value !== 'object') {
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
                    const v = valueObject.filter((item) => item[0] === _f)[0]?.[1].toString()

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
        (object, index) =>
            index === updates.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(object))
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
        return ''
    }
    let _addr = addr.toString()

    return isAddress(_addr)
        ? _addr.substring(0, 5) + '...' + _addr.substring(_addr.length - 5, _addr.length)
        : _addr
}