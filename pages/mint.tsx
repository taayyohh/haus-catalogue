import React from "react"
import { MetadataForm } from "modules/mint"
import { MerkleTree } from "merkletreejs"
import useSWR from "swr"
import { isCatalogueArtist } from "utils/isCatalogueArtist"
import { useSigner } from "wagmi"
const keccak256 = require("keccak256")

const Mint: React.FC<{ allow: string[] }> = ({ allow }) => {
  const leaves = allow?.map(x => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const leaf = (address: string) => keccak256(address)
  const hexProof = (leaf: any) => tree.getHexProof(leaf)
  const positionalHexProof = (leaf: any) => tree.getPositionalHexProof(leaf)
  const proof = (leaf: any) => tree.getProof(leaf)
  const { data: signer } = useSigner()
  //@ts-ignore
  const signerAddress = signer?._address
  const { data: root } = useSWR("merkleRoot")

  return (
    <div>
      {isCatalogueArtist(signerAddress, root) && (
        <div className={"mx-auto mb-32 w-full rounded p-4 px-8 pt-32 sm:w-3/4 md:w-2/3"}>
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
