import React from "react"
import Nav from "./Nav"
import { useSigner } from "wagmi"
import { useLayoutStore } from "stores/useLayoutStore"
import Player from "./Player"
import { ethers } from "ethers"
import { init } from "fetchers/hausCatalogue"
import { initZoraV3 } from "fetchers/zoraV3"
import { ALCHEMY_RPC_URL } from "constants/rpc"

type Props = {
  children: JSX.Element
}

const Layout = ({ children }: Props) => {
  const { setSigner, setProvider, setSignerAddress } = useLayoutStore()
  const { data: signer, status } = useSigner()

  React.useEffect(() => {
    if (status === "success") {
      const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL)
      setProvider(signer?.provider ?? provider)
      setSigner(signer)
      //@ts-ignore
      setSignerAddress(signer?._address)
    }
  }, [status, signer])

  /*
    initialize SWR variables
   */
  init()
  initZoraV3()

  return (
    <div className="min-h-screen">
      <Nav />
      {children}
      <Player />
    </div>
  )
}

export default Layout
