import { ethers } from "ethers"
import {Provider} from "@wagmi/core";

export async function isValidAddress(address: string, provider: Provider | undefined) {
  const resolvedName = await provider?.resolveName(address)

  return !!resolvedName || ethers.utils.isAddress(address)
}

export async function getEnsAddress(address: string, provider: Provider | undefined) {
  const resolvedName = await provider?.resolveName(address)

  return resolvedName ?? address
}

export async function getEnsName(address: string, provider: Provider | undefined) {
  return provider?.lookupAddress(address);
}
