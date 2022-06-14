import { ConnectButton } from "@rainbow-me/rainbowkit"
import React from "react"
import { useRelativeTime } from "hooks/useRelativeTime"

const Nav = () => {
  const { formattedDate } = useRelativeTime()

  return (
    <div className="bg-slate-500 fixed flex w-full justify-between p-4 z-10">
      <input className="w-36" />

      <div>
        <div className="w-28">
          <img src="/lucidhaus.png" />
          <div>{formattedDate(new Date())}</div>
        </div>
      </div>

      <ConnectButton showBalance={false} label={"Connect"} chainStatus={"none"} accountStatus={"address"} />
    </div>
  )
}

export default Nav
