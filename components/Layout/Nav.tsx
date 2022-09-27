import { ConnectButton } from "@rainbow-me/rainbowkit"
import React from "react"
import Link from "next/link"
import useHausCatalogue from "hooks/useHausCatalogue"

const Nav = () => {
  const { isOwner, hausCatalogueContract } = useHausCatalogue()

  return (
    <div className="fixed z-10 flex w-full items-center justify-between bg-rose-200 p-4">
      <input
        className="focus:shadow-outline h-8 w-36 rounded bg-rose-200 px-4 placeholder:text-rose-500 focus:outline-none"
        placeholder="Search"
      />

      <div className="w-24">
        <Link href={"/"}>
          <img src="/lucidhaus.png" />
        </Link>
      </div>

      {isOwner && (
        <div className={"absolute right-[220px]"}>
          <Link href={"/mint"}>Mint</Link>
        </div>
      )}

      <div id="connect">
        <ConnectButton showBalance={true} label={"Connect"} chainStatus={"none"} accountStatus={"address"} />
      </div>
    </div>
  )
}

export default Nav
