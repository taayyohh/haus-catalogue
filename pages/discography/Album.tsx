import React from "react"
import { usePlayerStore } from "stores/usePlayerStore"
import { useLayoutStore } from "stores/useLayoutStore"
import { ethers } from "ethers"
import HAUS_ABI from "ABI/HausCatalogue.json"
import reserveAuctionABI from "@zoralabs/v3/dist/artifacts/ReserveAuctionCoreEth.sol/ReserveAuctionCoreEth.json"
import zoraModuleManagerABI from "@zoralabs/v3/dist/artifacts/ZoraModuleManager.sol/ZoraModuleManager.json"
import { toSeconds } from "../../utils/helpers"

const Album: React.FC<any> = ({ release, token }) => {
  const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
  const { signer, signerAddress } = useLayoutStore()
  const [contract, setContract] = React.useState<any>()

  React.useMemo(async () => {
    if (!signer) return

    try {
      const hausContract: any = new ethers.Contract(process.env.HAUS_CATALOGUE_PROXY || "", HAUS_ABI.abi, signer)
      const reserveAuctionContract = new ethers.Contract(
        "0x2506d9f5a2b0e1a2619bcce01cd3e7c289a13163",
        reserveAuctionABI.abi,
        signer
      )
      const zoraModuleManager = new ethers.Contract(
        "0x9458E29713B98BF452ee9B2C099289f533A5F377",
        zoraModuleManagerABI.abi,
        signer
      )
      setContract({ hausContract, reserveAuctionContract, zoraModuleManager })
    } catch (err) {
      console.log("err", err)
    }
  }, [signer, HAUS_ABI])

  /*

    Transfer Helper Approval

   */
  const [isApproved, setIsApproved] = React.useState<boolean>(false)
  React.useMemo(async () => {
    if (!contract?.hausContract || !signerAddress) return

    const isApproved = await contract.hausContract.isApprovedForAll(
      signerAddress, // NFT owner address
      "0xd1adAF05575295710dE1145c3c9427c364A70a7f" // V3 Module Transfer Helper to approve
    )
    setIsApproved(isApproved)
  }, [contract?.hausContract, signerAddress])

  const handleApproval = React.useCallback(async () => {
    await contract.hausContract.setApprovalForAll("0xd1adAF05575295710dE1145c3c9427c364A70a7f", true)
  }, [contract?.reserveAuctionContract, contract?.hausContract])

  /*

    Module Manager Approval

   */
  const [isModuleManagerApproved, setIsModuleManagerApproved] = React.useState<boolean>(false)
  React.useMemo(async () => {
    if (!signerAddress || !contract?.zoraModuleManager) return

    const approved = await contract?.zoraModuleManager?.isModuleApproved(
      signerAddress,
      "0x2506d9f5a2b0e1a2619bcce01cd3e7c289a13163"
    )

    setIsModuleManagerApproved(approved)
  }, [signerAddress, contract?.zoraModuleManager])

  const handleApprovalManager = React.useCallback(async () => {
    await contract?.zoraModuleManager.setApprovalForModule("0x2506d9f5a2b0e1a2619bcce01cd3e7c289a13163", true)
  }, [contract?.zoraModuleManager])

  const createAuction = React.useCallback(async () => {
    if (!contract?.reserveAuctionContract) return

    await contract?.reserveAuctionContract.createAuction(
      token?.collectionAddress,
      Number(token.tokenId),
      toSeconds({ days: 1 }),
      ethers.utils.parseEther("1"),
      token.owner,
      Date.now()
    )
  }, [contract?.reserveAuctionContract, token, release])


  const [auctionInfo, setAuctionInfo] = React.useState<any>()
  React.useMemo(async () => {
    if (!contract?.reserveAuctionContract) return

    const c = contract?.reserveAuctionContract
    const a = await c.auctionForNFT(token.collectionAddress, token.tokenId)

    console.log("ca", contract?.reserveAuctionContract)
    console.log('a', a)
    console.log('rserve', ethers.utils.formatEther(a?.reservePrice))
    setAuctionInfo({
      reservePrice: ethers.utils.formatEther(a?.reservePrice)
    })
    //
    // duration
    //     :
    //     86400
    // firstBidTime
    //     :
    //     0
    // highestBid
    //     :
    //     BigNumber {_hex: '0x00', _isBigNumber: true}
    // highestBidder
    //     :
    //     "0x0000000000000000000000000000000000000000"
    // reservePrice
    //     :
    //     BigNumber {_hex: '0x0de0b6b3a7640000', _isBigNumber: true}
    // seller
    //     :
    //     "0xbF6f6491d05dECd4b08A65dEdCC2ef2b4424F617"
    // sellerFundsRecipient
    //     :
    //     "0xbF6f6491d05dECd4b08A65dEdCC2ef2b4424F617"
    // startTime
    //     :
    //     1569152771
    // length
    //     :


        }, [contract?.reserveAuctionContract, token])

  return (
    <div
      key={release.image}
      className="flex w-full flex-col items-center"
      onClick={() =>
        addToQueue([
          ...queuedMusic,
          {
            artist: release.artist,
            image: release.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/"),
            songs: [
              {
                audio: [release.losslessAudio.replace("ipfs://", "https://ipfs.io/ipfs/")],
                title: release.title,
                trackNumber: release.trackNumber,
              },
            ],
          },
        ])
      }
    >
      <img src={release.project.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
      <div className="flex w-full flex-col items-start py-2">
        <div className="text-xl font-bold">{release.name}</div>
        <div>{release.artist}</div>
        {!isApproved && <div onClick={() => handleApproval()}>allow zora auction</div>}
        {!isModuleManagerApproved && <div onClick={() => handleApprovalManager()}>allow zora manager </div>}
        {isApproved && isModuleManagerApproved && <div onClick={() => createAuction()}>create auction</div>}
        {auctionInfo?.reservePrice > 0 && (
            <div>Bid: {auctionInfo?.reservePrice}</div>
        )}
      </div>
    </div>
  )
}

export default Album
