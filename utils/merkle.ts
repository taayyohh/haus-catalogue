// @ts-ignore
const { MerkleTree } = require("merkletreejs")
const SHA256 = require("crypto-js/sha256")

function merkle() {
  const leaves = [].map(x => SHA256(x))
  const tree = new MerkleTree(leaves, SHA256)
  const root = tree.getRoot().toString("hex")
  const leaf = SHA256("")
  const proof = tree.getProof(leaf)
  console.log("r", root)
  console.log(tree.verify(proof, leaf, root)) // true
}

merkle()
