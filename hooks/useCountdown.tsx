import dayjs from "dayjs"
import React from "react"

interface countdownResponseProps {
  countdownString: string
}

export const useCountdown = (auctionInfo: any) => {
  const [countdownString, setCountdownString] = React.useState("")

  React.useEffect(() => {
    if (!auctionInfo || auctionInfo.firstBidTime === 0) return

    // console.log('aaaa', auctionInfo?.seller === 0)

    const endAuction = (interval: NodeJS.Timer) => {
      clearInterval(interval)
      setCountdownString("0h 0m 0s")
      // setAuctionCompleted(true)
    }

    console.log("end")

    const interval = setInterval(() => {
      // console.log('a', auctionInfo)

      const now = dayjs.unix(Date.now() / 1000)
      const end = dayjs.unix(auctionInfo?.endTime as number)
      let countdown = end.diff(now, "second")

      countdown > 0 ? countdown-- : endAuction(interval)
      const countdownString = `${Math.floor(countdown / 3600)}h ${Math.floor((countdown % 3600) / 60)}m ${
        countdown % 60
      }s`
      // console.log('C', countdownString)
      setCountdownString(countdownString)
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
