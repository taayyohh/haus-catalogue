import SHA256 from 'crypto-js/sha256'
import { MerkleTree } from 'merkletreejs'

export const getMerkleProof = function (signerAddress: `0x${string}`) {
  const merkle = process.env.MERKLE
  const leaves = merkle?.split(',')?.map((x) => SHA256(x)) || []
  const tree = new MerkleTree(leaves, SHA256)
  const leaf = SHA256(signerAddress)
  return tree.getProof(leaf.toString())
}
