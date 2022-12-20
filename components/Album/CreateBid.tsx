import React from "react"
import Form from "components/Fields/Form"
import { createBidFields, createBidInitialValues, validateCreateBid } from "components/Fields/fields/createBidFields"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import useZoraV3 from "hooks/useZoraV3"
import { useLayoutStore } from "stores/useLayoutStore"
import { useAuction } from "hooks/useAuction"
import { useBalance } from "wagmi"
import useSWR, { mutate } from "swr"
import ZoraAuctionTag from "../Layout/ZoraAuctionTag"

const CreateBid: React.FC<{ release: any }> = ({ release }) => {
  const { createBid } = useZoraV3()
  const { signer, signerAddress } = useLayoutStore()
  const { auction } = useAuction(release)
  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    addressOrName: signerAddress as string,
  })
  const _balance = parseFloat(balance?.formatted as string).toFixed(4)
  const { data: ReserveAuctionCoreEth } = useSWR("ReserveAuctionCoreEth")

  /*

   handle place bid

  */

  const [isSubmitting, setIsSubmitting] = React.useState<undefined | boolean>(undefined)
  const handeCreateBid = React.useCallback(
    async (values: any) => {
      await createBid(release?.collectionAddress, release?.tokenId, values?.amount)
      setIsSubmitting(true)
      ReserveAuctionCoreEth.on("AuctionBid", (tokenContract: any, tokenId: any, firstBid: any, auction: any) => {
        mutate(["ActiveBid", Number(tokenId).toString()])
        mutate(["ActiveBidHistory", Number(tokenId).toString()])
        mutate([`${release?.collectionAddress}+${release?.tokenId}`])
        setIsSubmitting(false)
      })
    },
    [ReserveAuctionCoreEth]
  )

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
              fields={createBidFields({ helperText: auction?.minBid, balance: _balance })}
              initialValues={createBidInitialValues}
              validationSchema={validateCreateBid(auction?.minBid || 0)}
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
