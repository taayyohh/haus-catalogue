import React from "react"
import Form from "components/Fields/Form"
import { createBidFields, createBidInitialValues, validateCreateBid } from "components/Fields/fields/createBidFields"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import useZoraV3 from "hooks/useZoraV3"
import { useLayoutStore } from "stores/useLayoutStore"
import { useAuction } from "hooks/useAuction"
import { useBalance } from 'wagmi'


const CreateBid: React.FC<any> = ({ release }) => {
  const { zoraContracts, createBid } = useZoraV3()
  const { signer, signerAddress } = useLayoutStore()
  const { auction } = useAuction(release)
  const { data: balance, isError, isLoading } = useBalance({
    addressOrName: signerAddress as string,
  })
  const _balance = parseFloat(balance?.formatted as string).toFixed(4)

  /*

   handle place bid

  */

  const handeCreateBid = React.useCallback(
    (values: any) => {
      createBid(release?.collectionAddress, release?.tokenId, values?.amount)
    },
    [zoraContracts?.ReserveAuctionCoreEth]
  )

  return (
    <div className={"flex flex-col"}>
      <div className={"mb-8 flex items-center gap-5"}>
        <div className={"h-20 w-20"}>
          <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
        </div>
        <div className={"flex flex-col"}>
          <div className="text-xl font-bold">{release?.name}</div>
          <div>{release?.metadata?.artist}</div>
        </div>
      </div>
      {(!!signer && (
        <Form
          fields={createBidFields({ helperText: auction?.minBid, balance: _balance })}
          initialValues={createBidInitialValues}
          validationSchema={validateCreateBid(auction?.minBid || 0)}
          submitCallback={handeCreateBid}
          buttonText={"Place Bid"}
        />
      )) || <ConnectButton showBalance={true} label={"CONNECT"} chainStatus={"none"} accountStatus={"address"} />}
    </div>
  )
}

export default CreateBid
