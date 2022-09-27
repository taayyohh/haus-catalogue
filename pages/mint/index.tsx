import React from "react"
import MetadataForm from "./MetaDataForm/MetadataForm"
import { MerkleTree } from "merkletreejs"
import { useLayoutStore } from "stores/useLayoutStore"
const keccak256 = require("keccak256")

const Mint: React.FC<{ allow: string[] }> = ({ allow }) => {
  const leaves = allow?.map(x => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const leaf = (address: string) => keccak256(address)
  const hexProof = (leaf: any) => tree.getHexProof(leaf)
  const positionalHexProof = (leaf: any) => tree.getPositionalHexProof(leaf)
  const proof = (leaf: any) => tree.getProof(leaf)
  const { isCatalogueArtist } = useLayoutStore()

  return (
    <div className={"bg-rose-200"}>
      {isCatalogueArtist && (
        <div className={"mx-auto mb-32 w-full rounded p-4 px-8 pt-32 sm:w-3/4 md:w-2/3 lg:w-2/5"}>
          <MetadataForm merkle={{ hexProof, positionalHexProof, proof, leaf, tree, leaves }} />
        </div>
      )}
    </div>
  )
}

export default Mint

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
