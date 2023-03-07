/**
 * Takes a possibly undefined array and returns either the array, or an array of undefined of
 * length expectedLength
 *
 * @param array possibly undefined array
 * @param expectedLength the expected length of the array if it were not undefined
 * @returns {T | undefined[]}
 */
export function unpackOptionalArray<T = []>(
    array: T | undefined,
    expectedLength: number
): T | undefined[] {
    if (!array) {
        return Array(expectedLength).fill(undefined)
    }
    return array
}
