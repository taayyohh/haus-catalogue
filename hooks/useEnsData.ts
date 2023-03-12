import { useEnsAddress, useEnsAvatar, useEnsName } from 'wagmi'

import { walletSnippet } from '../utils/walletSnippet'

export const useEnsData = (address?: string | undefined) => {
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    //@ts-ignore
    address,
  })

  const { data: ensAvatar } = useEnsAvatar({
    address: address as `0x${string}`,
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
