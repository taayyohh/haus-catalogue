/**
 * Flattens Nested Object
 *
 * @params object
 * @returns object
 */

export const flatten = (object: object) => {
    return Object.assign(
        {},
        ...(function _flatten(o: object): any[] {
            // @ts-ignore
            return [].concat(...Object.keys(o).map(k => (typeof o[k] === "object" ? _flatten(o[k]) : { [k]: o[k] })))
        })(object)
    )
}
