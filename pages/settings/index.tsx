import React from "react"
import { ethers } from "ethers"
import HAUS_ABI from "../../out/HausCatalogue.sol/HausCatalogue.json"
import { useLayoutStore } from "../../stores/useLayoutStore"

const Settings = () => {
  const { signer } = useLayoutStore()

  const [contract, setContract] = React.useState<any>()
  React.useMemo(async () => {
    if (!signer) return

    try {
      const contract: any = new ethers.Contract(
        "0x3da452152183140f1eb94b55a86f1671d51d63f4" || "",
        HAUS_ABI.abi,
        signer
      )
      setContract(contract)
    } catch (err) {
      console.log("err", err)
    }
  }, [signer, HAUS_ABI])

  return (
    <div>
      <div>Settings</div>
      <div
        className={"mt-24"}
        onClick={() => {
          contract?.updateRoot(
            ethers.utils.hexlify("0x44165513cd2c8e77387d493e596c9b35b4a05a42e92d6d5b2b5606c37d2f0a99")
          )
        }}
      >
        update root
      </div>
    </div>
  )
}

export default Settings
