import dayjs from "dayjs"
import React from "react"

interface countdownResponseProps {
  countdownString: string
}

export const useCountdown = (auctionInfo: any) => {
  const [countdownString, setCountdownString] = React.useState("")
  React.useEffect(() => {
    if (!auctionInfo || auctionInfo.firstBidTime === 0) return
    const endAuction = (interval: NodeJS.Timer) => {
      clearInterval(interval)
      setCountdownString("0h 0m 0s")
    }

    const interval = setInterval(() => {
      // console.log('a', auctionInfo)

      const now = dayjs.unix(Date.now() / 1000)
      const end = dayjs.unix(auctionInfo?.endTime as number)
      let countdown = end.diff(now, "second")

      if (countdown > 0) {
        countdown--
        setCountdownString(
          `${Math.floor(countdown / 3600)}h ${Math.floor((countdown % 3600) / 60)}m ${countdown % 60}s`
        )
      } else {
        endAuction(interval)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [auctionInfo])

  const response: countdownResponseProps = {
    countdownString,
  }

  return { ...response }
}
