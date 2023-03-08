import SHA256 from 'crypto-js/sha256'
import { MerkleTree } from 'merkletreejs'

export const isCatalogueArtist = function (signerAddress: `0x${string}`) {
  const merkle = process.env.MERKLE
  const leaves = merkle?.split(',')?.map((x) => SHA256(x)) || []
  const tree = new MerkleTree(leaves, SHA256)
  const root = tree.getRoot().toString('hex')
  const leaf = SHA256(signerAddress)
  const proof = tree.getProof(leaf.toString())

  return tree.verify(proof, leaf.toString(), root)
}
