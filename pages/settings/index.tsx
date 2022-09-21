import React from "react"
import { ethers } from "ethers"
import HAUS_ABI from "ABI/HausCatalogue.json"
import { useLayoutStore } from "stores/useLayoutStore"
import { MerkleTree } from "merkletreejs"
const keccak256 = require("keccak256")

const Settings: React.FC<any> = ({ allow }) => {
  const { signer, signerAddress } = useLayoutStore()
  const [contract, setContract] = React.useState<any>()
  const [owner, setOwner] = React.useState("")

  React.useMemo(async () => {
    if (!signer) return

    try {
      const contract: any = new ethers.Contract(process.env.HAUS_CATALOGUE_PROXY || "", HAUS_ABI.abi, signer)
      setContract(contract)
    } catch (err) {
      console.log("err", err)
    }
  }, [signer, HAUS_ABI])

  React.useMemo(async () => {
    if (!contract) return

    setOwner(await contract.owner())
  }, [contract])

  /*
  
    generate root
  

   */
  const leaves = allow?.map((x: string) => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const root = tree.getHexRoot()

  return (
    <div>
      <div>Settings</div>
      {owner && signerAddress && ethers.utils.getAddress(owner) === ethers.utils.getAddress(signerAddress) && (
        <div>
          <div
            className={"mt-24"}
            onClick={() => {
              contract?.updateRoot(root)
            }}
          >
            update root
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings

export async function getStaticProps() {
  const allow = process.env.MERKLE?.split(",")

  try {
    return {
      props: {
        allow,
      },
    }
  } catch (error: any) {
    return {
      props: {
        error: error.reason,
      },
    }
  }
}
