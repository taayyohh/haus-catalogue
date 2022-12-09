import React from "react"
import { GetServerSideProps } from "next"
import { slugify } from "utils/helpers"
import useSWR, { SWRConfig } from "swr"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { getDiscography } from "utils/getDiscographyNullMetadata"
import { useAuction } from "hooks/useAuction"
import useHausCatalogue from "hooks/useHausCatalogue"
import { ethers } from "ethers"
import { activeAuctionQuery, activeAuctionStartBlock } from "query/activeAuction"
import { BsFillPlayFill } from "react-icons/bs"
import { usePlayerStore } from "stores/usePlayerStore"
import Meta from "components/Layout/Meta"
import { HAUS_CATALOGUE_PROXY } from "constants/addresses"
import { tokenEventHistory } from "query/tokenEventHistory"
import SongNav from "components/Layout/SongNav"
import { ETHER_ACTOR_BASE_URL, ETHERSCAN_BASE_URL } from "constants/etherscan"
import dayjs from "dayjs"
import { useEnsData } from "hooks/useEnsData"
import CopyButton from "components/Shared/CopyButton"
import AnimatedModal from "components/Modal/Modal"
import CreateBid from "components/Album/CreateBid"
import { fetchTransaction } from "@wagmi/core"
import SettleAuction from "../../../components/Album/SettleAuction"
import Image from "next/image"
import axios from "axios"
import History from "./History"

const ReactHtmlParser = require("react-html-parser").default

export const getServerSideProps: GetServerSideProps = async context => {
  const artist = context?.params?.artist as string
  const song = context?.params?.song as string
  const slug = context?.resolvedUrl

  try {
    const { fallback, discography } = await getDiscography()
    const tokens = activeAuctionQuery()

    return {
      props: {
        artist,
        song,
        slug,
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

const Song = ({ artist, song, slug }: any) => {
  const { data: release } = useSWR(`${artist}/${song}`)
  const router = useRouter()
  const { auction } = useAuction(release)
  const { royaltyInfo, royaltyPayoutAddress } = useHausCatalogue()

  const { data: _royaltyPayoutAddress } = useSWR(
    release?.tokenId ? ["royaltyPayoutAddress", release.tokenId] : null,
    async () => {
      return await royaltyPayoutAddress(Number(release?.tokenId))
    }
  )
  const { displayName: displayRoyalty, ensAvatar: royaltyEnsAvatar } = useEnsData(_royaltyPayoutAddress as string)
  const { displayName: displayOwner, ensAvatar: ownerEnsAvatar } = useEnsData(release?.owner as string)

  const { data: activeAuction } = useSWR(release?.tokenId ? ["activeAuction", release.tokenId] : null, async () => {
    return await activeAuctionStartBlock(release.tokenId)
  })

  const { data: creatorShare } = useSWR(release?.tokenId ? ["royaltyInfo", release.tokenId] : null, async () => {
    const bps = 10000
    const royaltyBPS = await royaltyInfo(Number(release?.tokenId), bps)
    return Number(royaltyBPS?.royaltyAmount) / 100
  })

  const { data: ReserveAuctionCoreEth } = useSWR("ReserveAuctionCoreEth")

  const { data: bidHistory } = useSWR(
    release?.tokenId && ReserveAuctionCoreEth && activeAuction ? ["AuctionBid", release.tokenId] : null,
    async () => {
      const events = await ReserveAuctionCoreEth?.queryFilter("AuctionBid" as any, activeAuction, "latest")

      return events
        .filter(
          (event: { tokenContract: string; args: any }) =>
            ethers.utils.getAddress(event.args.tokenContract) === ethers.utils.getAddress(HAUS_CATALOGUE_PROXY) &&
            Number(event.args.tokenId) === Number(release?.tokenId)
        )
        .reverse()
    },
    { revalidateOnFocus: false }
  )

  const { addToQueue, queuedMusic } = usePlayerStore()
  const [activeTab, setIsActiveTab] = React.useState("History")

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
        <Meta
          title={release?.name}
          type={"music.song"}
          image={release?.image?.url?.replace("ipfs://", "https://ipfs.io/ipfs/")}
          slug={slug}
          album={release?.metadata?.albumTitle}
          track={release?.metadata?.trackNumber}
          musician={release?.metadata?.artist}
          description={release?.metadata.artist}
        />

        <div className={"mx-auto w-11/12 pt-32 sm:w-4/5"}>
          <div className={"flex flex-col items-center gap-10 pt-12 sm:flex-row"}>
            <div
              className={
                "relative h-full w-full sm:h-[300px] sm:min-h-[300px] sm:w-[300px] sm:min-w-[300px] md:h-[400px] " +
                "md:min-h-[400px] md:w-[400px] md:min-w-[400px] " +
                "rounded-xl border lg:h-[500px] lg:min-h-[500px] lg:w-[500px] lg:min-w-[500px]"
              }
            >
              <Image
                layout="fill"
                src={release?.metadata?.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")}
                style={{ borderRadius: 10 }}
                alt={`Album cover for ${release?.name}`}
              />
            </div>
            <div>
              <div className={"flex items-center justify-center"}>
                <div
                  className={
                    "mr-6 flex h-[80px] min-h-[80px] w-[80px] min-w-[80px] items-center justify-center rounded-full border-2 "
                  }
                >
                  <BsFillPlayFill
                    size={44}
                    color={"black"}
                    className={"cursor-pointer"}
                    onClick={() =>
                      addToQueue([
                        ...queuedMusic,
                        {
                          artist: release?.metadata?.artist,
                          image: release?.metadata?.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/"),
                          songs: [
                            {
                              audio: [release?.metadata?.losslessAudio.replace("ipfs://", "https://ipfs.io/ipfs/")],
                              title: release?.metadata?.title,
                              trackNumber: release?.metadata?.trackNumber,
                            },
                          ],
                        },
                      ])
                    }
                  />
                </div>
                <div className={"flex flex-col"}>
                  <div className={"cursor-pointer text-4xl font-bold hover:text-gray-700"}>
                    {release?.metadata?.name}
                  </div>
                  <div className={"text-3xl"}>
                    <Link href={`/${slugify(release.metadata.artist)}`}>{release.metadata.artist}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"mx-auto w-11/12 pt-16 pb-48 sm:w-4/5"}>
          <div className={"border-b pb-2 text-2xl font-bold"}>Record Details</div>
          <div className={"pt-4"}>{ReactHtmlParser(release?.metadata?.description)}</div>
          <div className={"mt-6 flex gap-10"}>
            <div className={"flex flex-col text-xl"}>
              <div className={"text-gray-500"}>Date Pressed</div>
              {/*<div>*/}
              {/*  <a href={`${ETHERSCAN_BASE_URL}/block/${eventHistory?.mintBlock}`}>*/}
              {/*    {dayjs(eventHistory?.mintTime).format("MMMM, DD YYYY")}*/}
              {/*  </a>*/}
              {/*</div>*/}
            </div>
            <div className={"flex flex-col text-xl"}>
              <div className={"text-gray-500"}>Format</div>
              <div>{release?.metadata?.mimeType.replace("audio/", ".")}</div>
            </div>
            <div className={"flex flex-col text-xl"}>
              <div className={"text-gray-500"}>Token ID</div>
              <a
                target="_blank"
                href={`https://goerli.etherscan.io/token/${release?.collectionAddress}?a=${release?.tokenId}#inventory`}
              >
                {release?.tokenId}
              </a>
            </div>
          </div>
          <div className={"mt-12 flex flex-col gap-10 sm:grid sm:grid-cols-[4fr,6fr]"}>
            <div>
              <div className={"text-2xl font-bold"}>Auction Info</div>
              <div className={"mt-2 rounded-xl border bg-white p-8"}>
                <div className={"flex flex-col"}>
                  {auction?.auctionHasStarted && !auction?.auctionHasEnded && (
                    <div className={"flex flex-col"}>
                      <div className={"mb-4"}>
                        <div className={"text-lg text-gray-500"}>Reserve price</div>
                        <div className={"text-2xl"}>{auction?.reservePrice} ETH</div>
                      </div>
                    </div>
                  )}
                  <div className={"mb-1 flex justify-between border-b pb-1"}>
                    <div className={"text-lg text-gray-500"}>Artist share</div>
                    <div className={"text-xl"}>{creatorShare}%</div>
                  </div>
                  <div className={"flex justify-between"}>
                    <div className={"text-lg text-gray-500"}>Current owner</div>
                    <div className={"flex cursor-pointer items-center gap-2"}>
                      {displayOwner} <CopyButton text={release?.owner} />
                    </div>
                  </div>
                  <div className={"flex items-center justify-between"}>
                    <div className={"text-lg text-gray-500"}>Royalty Recipient</div>
                    <div className={"flex cursor-pointer items-center gap-2"}>
                      {displayRoyalty} <CopyButton text={_royaltyPayoutAddress} />
                    </div>
                  </div>
                  {(!auction?.notForAuction && !auction?.auctionHasEnded && (
                    <AnimatedModal
                      trigger={
                        <button
                          className={"mt-4 w-full rounded bg-emerald-600 py-2 text-xl text-white hover:bg-emerald-500"}
                        >
                          Place Bid
                        </button>
                      }
                      size={"auto"}
                    >
                      <CreateBid release={release} />
                    </AnimatedModal>
                  )) || (
                    <>
                      {auction?.auctionHasStarted && (
                        <AnimatedModal
                          trigger={
                            <button
                              className={
                                "mt-4 w-full rounded bg-emerald-600 py-2 text-xl text-white hover:bg-emerald-500"
                              }
                            >
                              Settle
                            </button>
                          }
                          size={"auto"}
                        >
                          <SettleAuction release={release} />
                        </AnimatedModal>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className={"flex gap-5"}>
                <div
                  className={`cursor-pointer text-2xl font-bold ${
                    activeTab === "Bid" ? "text-emerald-500" : "hover:text-emerald-500"
                  }`}
                >
                  Bid
                </div>
                <div
                  className={`cursor-pointer text-2xl font-bold ${
                    activeTab === "History" ? "text-emerald-500 " : " hover:text-emerald-500"
                  } `}
                >
                  History
                </div>
              </div>
              <div className={"mt-2 box-border rounded-xl border bg-white p-8"}>
                <History release={release} />
                {/*{bidHistory?.map(({ transactionHash, args }: any) => {*/}
                {/*  return (*/}
                {/*    <div className={"box-border w-full pb-2"}>*/}
                {/*      <div>*/}
                {/*        Bid placed by {args?.auction?.highestBidder} for{" "}*/}
                {/*        {ethers.utils.formatEther(Number(args?.auction?.highestBid).toString())} ETH*/}
                {/*      </div>*/}
                {/*      <a href={`${ETHERSCAN_BASE_URL}/tx/${transactionHash}`} target={"_blank"}>*/}
                {/*        etherscan*/}
                {/*      </a>*/}
                {/*      /!*<div>{auction?.highestBid}</div>*!/*/}
                {/*    </div>*/}
                {/*  )*/}
                {/*})}*/}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function SongPage({ fallback, artist, song, slug }: any) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <SongNav artist={artist} song={song} />
      <Song artist={artist} song={song} slug={slug} />
    </SWRConfig>
  )
}
