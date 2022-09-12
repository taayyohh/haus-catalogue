// @ts-ignore
const { MerkleTree } = require("merkletreejs")
const SHA256 = require("crypto-js/sha256")

function merkle() {
  const leaves = [
    "0x794b769D5C7E4d66D9a8D1da91E9cb7A94Bb18e7",
    "0x2b5CCaFd39e4Afee37608F19bE83fef447F0b7a8",
    "0xe61cD248Fe04dF4C79E1492778c7939b6527CE7c",
    "0x4313b9563a54e1e352ac29c369d7b731cb09c975",
  ].map(x => SHA256(x))
  const tree = new MerkleTree(leaves, SHA256)
  const root = tree.getRoot().toString("hex")
  const leaf = SHA256("0x794b769D5C7E4d66D9a8D1da91E9cb7A94Bb18e7")
  const proof = tree.getProof(leaf)
  console.log("r", root)
  console.log(tree.verify(proof, leaf, root)) // true
}

merkle()
