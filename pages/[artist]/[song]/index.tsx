import Meta from 'components/Meta'
import { ZORA_V3_ADDRESSES } from 'constants/addresses'
import ABI from 'data/contract/abi/ReserveAuctionCoreETH.json'
import { FadeInOut } from 'layouts/FadeInOut'
import { GetServerSideProps } from 'next'
import React from 'react'
import useSWR, { SWRConfig } from 'swr'
import { AddressType } from 'typings'
import { useContractRead } from 'wagmi'

import { BidAndHistory } from 'modules/auction'
import { AlbumArt, AuctionInfo, ReleaseDetails } from 'modules/song'
import SongNav from 'modules/song/components/SongNav'
import { getDiscography } from 'modules/song/utils/getDiscography'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const artist = context?.params?.artist as string
  const song = context?.params?.song as string
  const slug = context?.resolvedUrl

  try {
    const { fallback, discography } = await getDiscography()

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
    console.log('err', error)
    return {
      notFound: true,
    }
  }
}

const Song = ({ artist, song, slug }: any) => {
  const { data: release } = useSWR(`${artist}/${song}`)
  const { data: auction }: any = useContractRead({
    enabled: !!release?.tokenId && !!release?.collectionAddress,
    abi: ABI,
    address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
    functionName: 'auctionForNFT',
    args: [release?.collectionAddress, release?.tokenId],
  })

  return (
    <>
      <Meta
        title={release?.name}
        type={'music.song'}
        image={release?.metadata?.image_uri?.track?.image.replace(
          'ipfs://',
          'https://nftstorage.link/ipfs/'
        )}
        slug={slug}
        album={release?.metadata?.albumTitle}
        track={release?.metadata?.trackNumber}
        musician={release?.metadata?.artist}
        description={`Listen to ${release?.name} by ${release?.metadata?.artist}.`}
      />
      {release ? (
        <FadeInOut k={release?.name}>
          <AlbumArt release={release} />
          <ReleaseDetails release={release} auction={auction} />
          <div
            className={
              'mt-12 mb-24 flex flex-col gap-10 sm:grid sm:grid-cols-[4fr,6fr] mx-auto w-11/12 pt-16 sm:w-4/5'
            }
          >
            <AuctionInfo auction={auction} release={release} />
            <BidAndHistory release={release} auction={auction} />
          </div>
        </FadeInOut>
      ) : null}
    </>
  )
}

export default function SongPage({ fallback, artist, song, slug }: any) {
  return (
    <SWRConfig value={{ fallback }}>
      <SongNav artist={artist} song={song} />
      <Song artist={artist} song={song} slug={slug} />
    </SWRConfig>
  )
}
