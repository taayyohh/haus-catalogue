import React from "react"
import Form from "components/Fields/Form"
import {
  createAuctionFields,
  createAuctionInitialValues,
  validateCreateAuction,
} from "components/Fields/fields/createAuctionFields"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import useZoraV3 from "hooks/useZoraV3"
import { useLayoutStore } from "stores/useLayoutStore"
import AnimatedModal from "components/Modal/Modal"
import { toSeconds } from "utils/helpers"
import { ethers } from "ethers"
import ZoraAuctionTag from "../Layout/ZoraAuctionTag"

const CreateAuction: React.FC<any> = ({ release }) => {
  const { createAuction } = useZoraV3()
  const { signer } = useLayoutStore()

  /*
  
     handle Create Auction
  
    */

  const handleCreateAuction = React.useCallback(
    async (values: any) => {
      if (!createAuction) return

      const { wait } = await createAuction(
        release?.collectionAddress,
        Number(release?.tokenId),
        toSeconds(values?.duration),
        ethers.utils.parseEther(values?.reservePrice.toString()),
        ethers.utils.getAddress(values?.sellerFundsRecipient),
        Math.floor(Date.now() / 1000)
      )

      await wait()
      console.log("success")
    },
    [createAuction, release]
  )

  return (
    <AnimatedModal
      trigger={
        <button className={"hover: mb-2 flex w-full justify-center bg-white py-1 px-2 text-black"}>
          create auction
        </button>
      }
      size={"auto"}
    >
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
            fields={createAuctionFields()}
            initialValues={createAuctionInitialValues}
            submitCallback={handleCreateAuction}
            buttonText={"Create Auction"}
            children={<ZoraAuctionTag />}
          />
        )) || <ConnectButton showBalance={true} label={"CONNECT"} chainStatus={"none"} accountStatus={"address"} />}
      </div>
    </AnimatedModal>
  )
}

export default CreateAuction
