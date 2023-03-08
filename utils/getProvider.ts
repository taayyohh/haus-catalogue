import { ethers } from "ethers"
import { ALCHEMY_RPC_URL } from "constants/rpc"
import { StaticJsonRpcProvider } from "@ethersproject/providers"

let provider: StaticJsonRpcProvider | undefined

export function getProvider() {
  if (!provider) {
    // Use static provider to prevent re-querying for chain id since this won't change
    provider = new ethers.providers.StaticJsonRpcProvider(ALCHEMY_RPC_URL)
  }
  return provider
}
