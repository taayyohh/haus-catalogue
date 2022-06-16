import { ConnectButton } from "@rainbow-me/rainbowkit"
import React from "react"
import { useRelativeTime } from "hooks/useRelativeTime"

const Nav = () => {
  const { formattedDate } = useRelativeTime()

  return (
    <div className="fixed z-10 flex w-full justify-between bg-rose-300 p-4">
      <input
        className="focus:shadow-outline w-36 rounded-xl bg-rose-200 px-4 text-rose-800 focus:outline-none"
        placeholder="Search"
      />

      <div>
        <div className="w-28">
          <img src="/lucidhaus.png" />
          <div>{formattedDate(new Date())}</div>
        </div>
      </div>

        <div id="connect">
            <ConnectButton showBalance={false} label={"Connect"} chainStatus={"none"} accountStatus={"address"} />
        </div>
    </div>
  )
}

export default Nav
