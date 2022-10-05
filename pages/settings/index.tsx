import React from "react"
import { ethers } from "ethers"
import { useLayoutStore } from "stores/useLayoutStore"
import { MerkleTree } from "merkletreejs"
import useHausCatalogue from "hooks/useHausCatalogue"
import useZoraV3 from "hooks/useZoraV3"
import { HausCatalogue__factory } from "../../types/ethers-contracts"
import useSWR, { SWRConfig } from "swr"
const keccak256 = require("keccak256")

export async function getServerSideProps() {
  const allow = process.env.MERKLE?.split(",")

  try {
    return {
      props: {
        allow,
        fallback: {
          isApprovedForAll: null,
          owner: null,
        },
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

const Settings: React.FC<any> = ({ allow }) => {
  const { handleApprovalTransferHelper } = useHausCatalogue()
  const { handleApprovalManager, isModuleApproved } = useZoraV3()
  const { signer, provider, signerAddress } = useLayoutStore()
  const { data: isApprovedForAll } = useSWR("isApprovedForAll")
  const { data: owner } = useSWR("owner")

  const hausCatalogueContract = HausCatalogue__factory.connect(
    process.env.HAUS_CATALOGUE_PROXY || "",
    // @ts-ignore
    signer ?? provider
  )

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
      {isApprovedForAll === false && <div onClick={() => handleApprovalTransferHelper()}>allow zora auction</div>}
      {isModuleApproved === false && <div onClick={() => handleApprovalManager()}>allow zora manager </div>}
    </div>
  )
}

export default function SettingsPage({ fallback, allow }: any) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Settings allow={allow} />
    </SWRConfig>
  )
}
