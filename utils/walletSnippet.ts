import {isAddress} from "ethers/lib/utils";

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