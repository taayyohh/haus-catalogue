import {BigNumber, ethers} from "ethers"
import CopyButton from "components/CopyButton"
import { AuctionAction } from "./AuctionAction"
import React from "react"
import {useContractRead, useSigner} from "wagmi";
import CATALOGUE_ABI from "../../../data/contract/abi/HausCatalogueABI.json";
import {HAUS_CATALOGUE_PROXY, ZERO_ADDRESS} from "../../../constants/addresses";
import {AddressType} from "../../../typings";
import {useEnsData} from "../../../hooks/useEnsData";
import {ReleaseProps} from "../../../data/query/typings";

export const AuctionInfo: React.FC<{ auction: any, release: ReleaseProps }> = ({ auction, release }) => {
  const { data: signer } = useSigner()

  const { data: royaltyPayoutAddress }: any = useContractRead({
    enabled: !!signer,
    abi: CATALOGUE_ABI,
    address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
    functionName: "royaltyPayoutAddress", // @ts-ignore
    args: [BigNumber.from(release?.tokenId)],
  })

  const { data: royaltyInfo }: any = useContractRead({
    enabled: !!signer,
    abi: CATALOGUE_ABI,
    address: HAUS_CATALOGUE_PROXY as unknown as AddressType,
    functionName: "royaltyInfo", // @ts-ignore
    args: [BigNumber.from(release?.tokenId), 10000],
  })

  const creatorShare = `${Number(royaltyInfo?.royaltyAmount) / 100} %`

  const { displayName: displayRoyalty, ensAvatar: royaltyEnsAvatar } = useEnsData(royaltyPayoutAddress as string)
  const { displayName: displayOwner, ensAvatar: ownerEnsAvatar } = useEnsData(release?.owner as string)



  return (
    <div>
      <div className={"text-2xl font-bold"}>Auction Info</div>
      <div className={"mt-2 rounded-xl border bg-white p-8"}>
        <div className={"flex flex-col"}>
          {auction?.seller !== ZERO_ADDRESS && (
            <div className={"flex flex-col"}>
              <div className={"mb-4"}>
                <div className={"text-lg text-gray-500"}>Reserve price</div>
                <div className={"text-2xl"}>{ethers.utils.formatEther(auction.reservePrice.toString())} ETH</div>
              </div>
            </div>
          )}
          <div className={"mb-1 flex justify-between border-b pb-1"}>
            <div className={"text-lg text-gray-500"}>Artist share</div>
            <div className={"text-xl"}>{creatorShare}</div>
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
              {displayRoyalty} <CopyButton text={royaltyPayoutAddress} />
            </div>
          </div>
          <AuctionAction auction={auction} release={release} />
        </div>
      </div>
    </div>
  )
}
