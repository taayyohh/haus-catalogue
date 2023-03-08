import { ConnectButton } from "@rainbow-me/rainbowkit"
import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { isCatalogueArtist } from "utils/isCatalogueArtist"
import useSWR from "swr"
import { useSigner } from "wagmi"

const Nav = () => {
  const { data: signer } = useSigner()
  //@ts-ignore
  const signerAddress = signer?._address
  const { data: root } = useSWR("merkleRoot")
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const variants = {
    initial: {
      height: 0,
    },
    animate: {
      height: "auto",
    },
  }

  return (
    <>
      <div className="fixed z-10 hidden h-16 w-full items-center justify-end bg-[#F9F9F9] p-4 sm:flex">
        {/*<input*/}
        {/*  className="focus:shadow-outline h-8 w-36 rounded bg-[#f9f9f9] px-4 placeholder:text-slate-500 focus:outline-none"*/}
        {/*  placeholder="Search"*/}
        {/*/>*/}

        <button className="w-24 absolute left-1/2 -m-12">
          <Link href={"/"}>
            <img src="/lucidhaus.png" alt={"LucidHaus Logo"} />
          </Link>
        </button>
        {isCatalogueArtist(signerAddress, root) && (
          <div className={"absolute right-[220px]"}>
            <Link href={"/mint"}>Mint</Link>
          </div>
        )}

        <div id="connect">
          <ConnectButton showBalance={true} label={"Connect"} accountStatus={"address"} />
        </div>
      </div>
      <div className="fixed z-10 flex h-16 w-full items-center justify-between  border-b bg-white p-4 sm:hidden">
        <button className="w-24">
          <Link href={"/"}>
            <img src="/lucidhaus.png" />
          </Link>
        </button>
        <div className={"ml-4"} onClick={() => setIsOpen(flag => !flag)}>
          <HamburgerMenuIcon width={"24px"} height={"24px"} />
        </div>

        <motion.div
          variants={variants}
          className={`absolute left-0 top-16 flex flex w-full w-full flex-col items-center overflow-hidden bg-[#F1F1F1]`}
          initial={"initial"}
          animate={isOpen ? "animate" : "initial"}
        >
          {isCatalogueArtist(signerAddress, root) && (
            <div className={"flex mr-12"}>
              <Link href={"/mint"}>Mint</Link>
            </div>
          )}
          <div id="connect">
            <ConnectButton showBalance={true} label={"Connect"} chainStatus={"none"} accountStatus={"address"} />
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Nav
