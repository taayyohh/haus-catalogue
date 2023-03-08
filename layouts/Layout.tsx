import Nav from 'components/Nav'
import React from 'react'

import { Player } from 'modules/player'

type Props = {
  children: JSX.Element
}

const Layout = ({ children }: Props) => {
  /*
    initialize SWR variables
   */
  return (
    <div className="min-h-screen">
      <Nav />
      {children}
      <Player />
    </div>
  )
}

export default Layout
