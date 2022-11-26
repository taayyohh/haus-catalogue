import { useEnsAddress, useEnsAvatar, useEnsName } from "wagmi"
import { walletSnippet } from "utils/helpers"

export const useEnsData = (address?: string | undefined) => {
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    //@ts-ignore
    address,
  })

  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: address,
  })

  const { data: ensAddress } = useEnsAddress({
    name: address,
  })

  return {
    ensName,
    ensNameLoading,
    ensAvatar,
    ethAddress: ensAddress,
    displayName: ensName || walletSnippet(address),
  }
}
