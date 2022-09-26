import React from "react"
import Nav from "./Nav"
import { useSigner } from "wagmi"
import { useLayoutStore } from "stores/useLayoutStore"
import Player from "./Player"
import { ethers } from "ethers"

type Props = {
  children: JSX.Element
}

const Layout = ({ children }: Props) => {
  const { setSigner, setProvider, setSignerAddress } = useLayoutStore()
  const { data: signer, status } = useSigner()

  React.useEffect(() => {
    if (status === "success") {
      const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL)
      setProvider(signer?.provider ?? provider)
      setSigner(signer)
      //@ts-ignore
      setSignerAddress(signer?._address)
    }
  }, [status, signer, setProvider, setProvider])

  return (
    <div className="min-h-screen bg-rose-50">
      <Nav />
      {children}
      <Player />
    </div>
  )
}

export default Layout
