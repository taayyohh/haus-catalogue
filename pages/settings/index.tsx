import React from "react"
import { ethers } from "ethers"
import { useLayoutStore } from "stores/useLayoutStore"
import { MerkleTree } from "merkletreejs"
import useHausCatalogue from "hooks/useHausCatalogue"
import useZoraV3 from "hooks/useZoraV3"
const keccak256 = require("keccak256")

const Settings: React.FC<any> = ({ allow }) => {
  const { signerAddress } = useLayoutStore()
  const { hausCatalogueContract, owner, isApprovedForAll, handleApprovalTransferHelper } = useHausCatalogue()
  const { handleApprovalManager, isModuleApproved } = useZoraV3()

  /*
  
    generate root
  

   */
  const leaves = allow?.map((x: string) => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const root = tree.getHexRoot()

  return (
    <div className={"mx-auto w-3/4 pt-24"}>
      <div className={"pb-8 text-4xl"}>Settings</div>
      {owner && signerAddress && ethers.utils.getAddress(owner) === ethers.utils.getAddress(signerAddress) && (
        <div>
          <div>
            <div>The Merkle Proof Root</div>

            <button
              className={
                "inline-flex self-start rounded-xl border-2 border-rose-400 py-2 px-4 text-rose-400 hover:bg-rose-400 hover:text-white"
              }
              onClick={() => {
                hausCatalogueContract?.updateRoot(root)
              }}
            >
              update root
            </button>
          </div>
        </div>
      )}
      {!isApprovedForAll && <div onClick={() => handleApprovalTransferHelper()}>allow zora auction</div>}
      {!isModuleApproved && <div onClick={() => handleApprovalManager()}>allow zora manager </div>}
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
