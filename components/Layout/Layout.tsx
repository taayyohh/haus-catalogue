import React from "react"
import Nav from "./Nav"
import { useSigner } from "wagmi"
import { useLayoutStore } from "stores/useLayoutStore"
import Player from "./Player"
import { ethers } from "ethers"
import keccak256 from "keccak256"
import { MerkleTree } from "merkletreejs"
import useHausCatalogue from "hooks/useHausCatalogue"
import { init } from "../../fetchers/hausCatalogue"
import useSWR from "swr"

type Props = {
  children: JSX.Element
}

const Layout = ({ children }: Props) => {
  const { setSigner, setProvider, setSignerAddress, setIsCatalogueArtist } = useLayoutStore()
  const { data: signer, status } = useSigner()
  const ALLOW = process.env.MERKLE?.split(",") || []
  const leaves = ALLOW?.map(x => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, { sort: true })
  const leaf = (address: string) => keccak256(address)
  const hexProof = (leaf: any) => tree.getHexProof(leaf)
  const { signerAddress } = useLayoutStore()
  const { data: merkleRoot } = useSWR("merkleRoot")

  const isCatalogueArtist = React.useMemo(() => {
    if (!signerAddress || !merkleRoot) return

    const _leaf = leaf(signerAddress)
    const _proof = hexProof(_leaf)
    return tree.verify(_proof, _leaf, merkleRoot)
  }, [signerAddress, leaf, merkleRoot])

  React.useEffect(() => {
    if (status === "success") {
      const provider = new ethers.providers.InfuraProvider(5, process.env.INFURA_API_KEY)
      setProvider(signer?.provider ?? provider)
      setSigner(signer)
      //@ts-ignore
      setSignerAddress(signer?._address)
      setIsCatalogueArtist(isCatalogueArtist)
    }
  }, [status, signer, setProvider, setProvider, isCatalogueArtist])

  init()
  return (
    <div className="min-h-screen">
      <Nav />
      {children}
      <Player />
    </div>
  )
}

export default Layout
