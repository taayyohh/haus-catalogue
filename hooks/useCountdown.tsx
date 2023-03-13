import dayjs from 'dayjs'
import { ethers } from 'ethers'
import React from 'react'
import { useSigner } from 'wagmi'

interface countdownResponseProps {
  countdownString: string
}

export const useCountdown = (auctionInfo: any) => {
  const { data: signer } = useSigner()
  const [countdownString, setCountdownString] = React.useState('')
  React.useEffect(() => {
    if (!auctionInfo || auctionInfo.firstBidTime === 0) return
    const endAuction = (interval: NodeJS.Timer) => {
      clearInterval(interval)
      setCountdownString(
        //@ts-ignore
        auctionInfo?.highestBidder === signer?._address
          ? `Congrats! You won with a bid of ${ethers.utils.formatEther(
              auctionInfo.highestBid.toString()
            )} ETH.`
          : ``
      )
    }

    const interval = setInterval(() => {
      const now = dayjs.unix(Date.now() / 1000)
      const end = dayjs.unix(
        parseInt(auctionInfo?.firstBidTime + auctionInfo?.duration) as number
      )

      let countdown = end.diff(now, 'second')

      if (countdown > 0) {
        countdown--
        setCountdownString(
          `${Math.floor(countdown / 3600)}h ${Math.floor((countdown % 3600) / 60)}m ${
            countdown % 60
          }s`
        )
      } else {
        endAuction(interval)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [auctionInfo, signer])

  const response: countdownResponseProps = {
    countdownString,
  }

  return { ...response }
}
