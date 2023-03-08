import { ETHERSCAN_BASE_URL } from "constants/etherscan"
import dayjs from "dayjs"
import React from "react"
import { ReleaseProps } from "data/query/typings"
import useSWR from "swr"
import { tokenEventHistory } from "data/query/tokenEventHistory"
const ReactHtmlParser = require("react-html-parser").default

export const ReleaseDetails: React.FC<{ release: ReleaseProps; auction: any }> = ({ release, auction }) => {
  const { data: mintInfo } = useSWR(release?.tokenId ? ["xnt-info", release.tokenId] : null, async () => {
    const events = await tokenEventHistory(release.tokenId)

    //get mint even details, always the last item in the array
    const mintEvent = events[events.length - 1]
    const mintTime = mintEvent?.transactionInfo?.blockTimestamp
    const mintBlock = mintEvent?.transactionInfo?.blockNumber
    return { mintTime, mintBlock }
  })

  return (
    <div className={"mx-auto w-11/12 pt-16 sm:w-4/5"}>
      <div className={"border-b pb-2 text-2xl font-bold"}>Record Details</div>
      <div className={"pt-4"}>{ReactHtmlParser(release?.metadata?.description)}</div>
      <div className={"mt-6 flex gap-10"}>
        <div className={"flex flex-col text-xl"}>
          <div className={"text-gray-500"}>Date Minted</div>
          <div>
            <a href={`${ETHERSCAN_BASE_URL}/block/${mintInfo?.mintBlock}`}>
              {dayjs(mintInfo?.mintTime).format("MMMM, DD YYYY")}
            </a>
          </div>
        </div>
        <div className={"flex flex-col text-xl"}>
          <div className={"text-gray-500"}>Format</div>
          <div>{release?.metadata?.mimeType.replace("audio/", ".")}</div>
        </div>
        <div className={"flex flex-col text-xl"}>
          <div className={"text-gray-500"}>Token ID</div>
          <a
            target="_blank"
            href={`${ETHERSCAN_BASE_URL}/token/${release?.collectionAddress}?a=${release?.tokenId}#inventory`}
          >
            {release?.tokenId}
          </a>
        </div>
      </div>
    </div>
  )
}
