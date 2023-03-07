import React from "react"
import Nav from "../components/Nav"
import { init } from "fetchers/hausCatalogue"
import { initZoraV3 } from "fetchers/zoraV3"
import { Player } from "modules/player"

type Props = {
  children: JSX.Element
}

const Layout = ({ children }: Props) => {
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
