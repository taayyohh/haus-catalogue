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
