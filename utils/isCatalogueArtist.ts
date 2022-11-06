import keccak256 from "keccak256"
import { MerkleTree } from "merkletreejs"

export const isCatalogueArtist = function (signerAddress: string, root: string | Buffer) {
  const ALLOW = process.env.MERKLE?.split(",") || []
  const leaves = ALLOW?.map(x => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const leaf = (address: string) => keccak256(address)
  const hexProof = (leaf: any) => tree.getHexProof(leaf)

  const _leaf = leaf(signerAddress)
  const _proof = hexProof(_leaf)
  return tree.verify(_proof, _leaf, root)
}
