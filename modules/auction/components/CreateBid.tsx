import React from "react"
import Form from "components/Fields/Form"
import { createBidFields, createBidInitialValues, validateCreateBid } from "components/Fields/fields/createBidFields"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useBalance, useContractRead, useSigner } from "wagmi"
import ZoraAuctionTag from "../../../components/ZoraAuctionTag"
import { BigNumber, ethers } from "ethers"
import AUCTION_ABI from "data/contract/abi/ReserveAuctionCoreETH.json"
import { ZORA_V3_ADDRESSES } from "constants/addresses"
import { AddressType } from "typings"
import { prepareWriteContract, writeContract } from "@wagmi/core"

const CreateBid: React.FC<{ release: any }> = ({ release }) => {
  const { data: signer } = useSigner()
  const { data: balance } = useBalance({
    //@ts-ignore
    address: signer?._address as `0x${string}`,
  })
  const _balance = parseFloat(balance?.formatted as string).toFixed(4)

  const { data: auction }: any = useContractRead({
    enabled: !!release?.tokenId && !!release?.collectionAddress,
    abi: AUCTION_ABI,
    address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
    functionName: "auctionForNFT",
    args: [release?.collectionAddress, release?.tokenId],
  })

  const [isSubmitting, setIsSubmitting] = React.useState<undefined | boolean>(undefined)
  const handeCreateBid = async (values: any) => {
    try {
      console.log("hiii")
      const config = await prepareWriteContract({
        abi: AUCTION_ABI,
        address: ZORA_V3_ADDRESSES?.ReserveAuctionCoreEth as unknown as AddressType,
        functionName: "createBid",
        signer: signer,
        args: [release?.collectionAddress, BigNumber.from(release?.tokenId)],
        overrides: { value: ethers.utils.parseEther(values?.amount.toString()) },
      })
      setIsSubmitting(true)
      const { wait } = await writeContract(config)
      await wait()
      setIsSubmitting(false)
    } catch (error) {
      console.log("error", error)
    } finally {
    }
  }

  const auctionMinBid =
    parseFloat(ethers.utils.formatEther(auction?.highestBid)) +
      parseFloat(ethers.utils.formatEther(auction?.highestBid)) * 0.1 ||
    parseFloat(ethers.utils.formatEther(auction?.reservePrice))

  if (!auction?.seller) return null

  return (
    <div className={"flex flex-col"}>
      <div className={"mb-8 flex items-center gap-5"}>
        <div className={"h-20 w-20"}>
          <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://nftstorage.link/ipfs/")} />
        </div>
        <div className={"flex flex-col"}>
          <div className="text-xl font-bold">{release?.name}</div>
          <div>{release?.metadata?.artist}</div>
        </div>
      </div>
      {(!!signer && (
        <>
          {isSubmitting === false && <div>Bid Placed!</div>}
          {isSubmitting === true && <div>Is Submitting</div>}
          {isSubmitting === undefined && (
            <Form
              fields={createBidFields({ helperText: auctionMinBid || 0, balance: _balance })}
              initialValues={createBidInitialValues}
              validationSchema={validateCreateBid(auctionMinBid || 0)}
              submitCallback={handeCreateBid}
              buttonText={"Place Bid"}
              children={<ZoraAuctionTag />}
            />
          )}
        </>
      )) || <ConnectButton showBalance={true} label={"CONNECT"} chainStatus={"none"} accountStatus={"address"} />}
    </div>
  )
}

export default CreateBid
