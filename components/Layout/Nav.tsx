import { ConnectButton } from "@rainbow-me/rainbowkit"
import React from "react"
import { useRelativeTime } from "hooks/useRelativeTime"

const Nav = () => {
  const { formattedDate } = useRelativeTime()

  return (
    <div className="fixed z-10 flex w-full items-center justify-center bg-rose-300 p-4">
      <input
        className="absolute left-4 focus:shadow-outline w-36 rounded h-8 bg-rose-200 px-4 text-rose-800 focus:outline-none"
        placeholder="Search"
      />

      <div>
        <div className="w-24">
          <img src="/lucidhaus.png" />
          {/*<div>{formattedDate(new Date())}</div>*/}
        </div>
      </div>

        <div id="connect" className="absolute right-4">
            <ConnectButton showBalance={true} label={"Connect"} chainStatus={"none"} accountStatus={"address"} />
        </div>
    </div>
  )
}

export default Nav
