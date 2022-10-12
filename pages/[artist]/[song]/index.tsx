import React from "react"
import { GetServerSideProps } from "next"
import { slugify } from "utils/helpers"
import useSWR, { SWRConfig } from "swr"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"
import { getDiscography } from "utils/getDiscographyNullMetadata"
import { useAuction } from "hooks/useAuction"
import useHausCatalogue from "hooks/useHausCatalogue"
import AnimatedModal from "../../../components/Modal/Modal"
import CreateBid from "../../../components/Album/CreateBid"
import { useCountdown } from "../../../hooks/useCountdown"
import { useEnsAvatar, useEnsName } from "wagmi"
import { ethers } from "ethers"
const ReactHtmlParser = require("react-html-parser").default

export const getServerSideProps: GetServerSideProps = async context => {
  const artist = context?.params?.artist as string
  const song = context?.params?.song as string

  try {
    const { fallback, discography } = await getDiscography()

    return {
      props: {
        artist,
        song,
        fallback,
        discography,
      },
    }
  } catch (error: any) {
    console.log("err", error)
    return {
      notFound: true,
    }
  }
}

const Song = ({ artist, song }: any) => {
  const { data: release } = useSWR(`${artist}/${song}`)
  const router = useRouter()
  const { auction } = useAuction(release)
  const { royaltyInfo, royaltyPayoutAddress, hausCatalogueContract } = useHausCatalogue()
  const { data: _royaltyPayoutAddress } = useSWR(
    release?.tokenId ? ["royaltyPayoutAddress", release.tokenId] : null,
    async () => {
      return await royaltyPayoutAddress(Number(release?.tokenId))
    }
  )

  const { data: creatorShare } = useSWR(release?.tokenId ? ["royaltyInfo", release.tokenId] : null, async () => {
    const bps = 10000
    const royaltyBPS = await royaltyInfo(Number(release?.tokenId), bps)
    return Number(royaltyBPS?.royaltyAmount) / 100
  })

  const { countdownString } = useCountdown(auction)

  const { data: ens } = useEnsName({
    chainId: 1,
    address: ethers.utils.getAddress("0x794b769d5c7e4d66d9a8d1da91e9cb7a94bb18e7"),
  })

  const { data: avatar } = useEnsAvatar({
    addressOrName: ethers.utils.getAddress("0x794b769d5c7e4d66d9a8d1da91e9cb7a94bb18e7"),
    chainId: 1,
  })
  console.log("r", release?.owner)
  console.log("ens", ens, avatar)

  return (
    <AnimatePresence exitBeforeEnter={true}>
      <motion.div
        variants={{
          closed: {
            y: 0,
            opacity: 0,
          },
          open: {
            y: 0,
            opacity: 1,
          },
        }}
        initial="closed"
        animate="open"
        exit="closed"
      >
        <div
          className={
            "fixed relative top-16 flex hidden h-12 w-full items-center border-y-2 border-rose-100 bg-rose-200 sm:flex"
          }
        >
          <button onClick={() => router.back()} className={"absolute"}>
            <ChevronLeftIcon width={"28px"} height={"28px"} className={"ml-7 text-rose-100"} />
          </button>
          {(!auction?.notForAuction && (
            <div className={"mx-auto flex w-4/5 items-center justify-between"}>
              {(auction?.auctionHasStarted && !auction?.auctionHasEnded && (
                <div className={"flex items-center gap-3"}>
                  <div className={"relative h-2 w-2 rounded-full"}>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-900 opacity-50"></span>
                  </div>
                  <div className={"text-sm"}>auction ends: {countdownString}</div>
                </div>
              )) ||
                (auction?.auctionHasEnded && <div>{countdownString}</div>) || <div>Action has not yet kicked off</div>}
              <div className={"flex items-center"}>
                {(auction?.auctionHasStarted && !auction?.auctionHasEnded && (
                  <div className={"mr-4"}>
                    <span className={"font-bold"}>Current Bid: </span>
                    {auction?.highestBid} ETH
                  </div>
                )) || (
                  <div className={"mr-4"}>
                    <span className={"font-bold"}>Reserve Price</span>: {auction?.reservePrice} ETH
                  </div>
                )}
                <AnimatedModal
                  trigger={
                    <button className={"rounded bg-rose-400 px-2 py-1 text-white hover:bg-rose-500"}>Place Bid</button>
                  }
                  size={"auto"}
                >
                  <CreateBid release={release} />
                </AnimatedModal>
              </div>
            </div>
          )) || (
            <div className={"mx-auto flex w-4/5 items-center justify-between"}>
              <div className={"flex items-center"}>
                {" "}
                <span className={'font-bold'}>owned by</span>{" "}
                {avatar && (
                  <div className={"h-8 w-8 overflow-hidden rounded-full"}>
                    <img src={avatar} />
                  </div>
                )}
                {ens || release?.owner}
              </div>
            </div>
          )}
        </div>
        <div className={"mx-auto w-4/5 pt-32"}>
          <div className={"flex items-center gap-10 pt-12"}>
            <div className={"h-[500px] min-h-[500px] w-[500px] min-w-[500px]"}>
              <img src={release?.metadata?.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
            </div>
            <div>
              <div className={"flex items-center justify-center"}>
                <div
                  className={"mr-6 h-[80px] min-h-[80px] w-[80px] min-w-[80px] rounded-full border-2 border-rose-100"}
                ></div>
                <div className={"flex flex-col"}>
                  <div className={"text-4xl font-bold"}>{release?.metadata?.name}</div>
                  <div className={"text-3xl"}>
                    <Link href={`/${slugify(release.metadata.artist)}`}>{release.metadata.artist}</Link>
                  </div>
                </div>
              </div>

              {/*{console.log(release)}*/}
            </div>
          </div>
        </div>
        <div className={"mx-auto w-4/5 pt-16 pb-48"}>
          <div className={"border-b-2 border-rose-100 pb-2 text-2xl font-bold"}>Record Details</div>
          <div className={"pt-4"}>{ReactHtmlParser(release?.metadata?.description)}</div>
          <div className={"mt-6 flex gap-10"}>
            <div className={"flex flex-col text-xl"}>
              <div>Format</div>
              <div>{release?.metadata?.mimeType.replace("audio/", ".")}</div>
            </div>
            <div className={"flex flex-col text-xl"}>
              <div>Token ID</div>
              <div>{release?.tokenId}</div>
            </div>
          </div>
          <div className={"mt-12 grid grid-cols-[1fr,2fr] gap-10"}>
            <div>
              <div className={"text-2xl font-bold"}>Auction Info</div>
              <div className={"mt-2 rounded-xl border-2 border-rose-100 p-8"}>
                <div className={"flex flex-col"}>
                  <div className={"flex flex-col"}>
                    <div>Reserve price: {auction?.reservePrice} ETH</div>
                    <div></div>
                  </div>
                  <div>Creator share: {creatorShare}%</div>
                  <div>Current owner: {auction?.sellerFundsRecipient}</div>
                  <div>Royalty Recipient: {_royaltyPayoutAddress}</div>
                </div>
              </div>
            </div>
            <div>
              <div className={"text-2xl font-bold"}>Bid History</div>
              <div className={"mt-2 rounded-xl border-2 border-rose-100 p-8"}></div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function SongPage({ fallback, artist, song }: any) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Song artist={artist} song={song} />
    </SWRConfig>
  )
}
