import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { isCatalogueArtist } from 'utils/isCatalogueArtist'
import { useSigner } from 'wagmi'

const Nav = () => {
  const { data: signer } = useSigner()
  //@ts-ignore
  const signerAddress = signer?._address
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const variants = {
    initial: {
      height: 0,
    },
    animate: {
      height: 'auto',
    },
  }

  return (
    <>
      <div className="fixed z-10 hidden h-16 w-full items-center justify-end bg-[#F9F9F9] p-4 sm:flex">
        <button>
          <Link href={'/'} className="w-24 h-10 absolute left-1/2 -m-5 -ml-12">
            <Image fill src="/lucidhaus.png" alt={'lucidhaus logo'} />
          </Link>
        </button>
        {signer && isCatalogueArtist(signerAddress) && (
          <div className={'relative right-0'}>
            <Link href={'/mint'}>Mint</Link>
          </div>
        )}

        <div id="connect">
          <ConnectButton showBalance={true} label={'Connect'} accountStatus={'address'} />
        </div>
      </div>
      <div className="fixed z-10 flex h-16 w-full items-center justify-between  border-b bg-white p-4 sm:hidden">
        <button className="relative w-24">
          <Link href={'/'} className="flex relative w-24 h-10">
            <Image fill src="/lucidhaus.png" alt={'lucidhaus logo'} />
          </Link>
        </button>
        <div className={'ml-4'} onClick={() => setIsOpen((flag) => !flag)}>
          <HamburgerMenuIcon width={'24px'} height={'24px'} />
        </div>

        <motion.div
          variants={variants}
          className={`absolute left-0 top-16 flex flex w-full w-full flex-col items-center overflow-hidden bg-[#F1F1F1]`}
          initial={'initial'}
          animate={isOpen ? 'animate' : 'initial'}
        >
          {isCatalogueArtist(signerAddress) && (
            <div className={'flex mr-12'}>
              <Link href={'/mint'}>Mint</Link>
            </div>
          )}
          <div id="connect">
            <ConnectButton
              showBalance={true}
              label={'Connect'}
              chainStatus={'none'}
              accountStatus={'address'}
            />
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Nav
