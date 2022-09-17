const { MerkleTree } = require("merkletreejs")
const SHA256 = require("crypto-js/sha256")

function merkle() {
  console.log('m', process.env.MERKLE)
  // const leaves = process.env.MERKLE?.split(",").map(x => SHA256(x))
  // const tree = new MerkleTree(leaves, SHA256)
  // const root = tree.getRoot().toString("hex")
  // const leaf = SHA256("0x794b769D5C7E4d66D9a8D1da91E9cb7A94Bb18e7")
  // const proof = tree.getProof(leaf)

  // console.log("tree", tree)
  // console.log(tree.verify(proof, leaf, root)) // true
}

merkle()
