import { ConnectButton } from "@rainbow-me/rainbowkit"
import React from "react"
import { useRelativeTime } from "hooks/useRelativeTime"

const Nav = () => {
  const { formattedDate } = useRelativeTime()

  return (
    <div className="fixed z-10 flex w-full items-center justify-center bg-rose-200 p-4">
      <input
        className="focus:shadow-outline absolute left-4 h-8 w-36 rounded bg-rose-200 px-4 placeholder:text-rose-500 focus:outline-none"
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
