import React from "react"

const ZoraAuctionTag = () => {
  return (
    <div className={"mt-6 flex items-center justify-end gap-3 text-xs uppercase"}>
      <a
        target={"_blank"}
        href={"https://docs.zora.co/docs/smart-contracts/modules/ReserveAuctions/Core/zora-v3-auctions-coreETH"}
        className={"flex  items-center justify-center  gap-3 "}
      >
        <span>Powered by</span>
        <div>
          <svg width="33" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
            <rect x="0.5" width="32" height="32" rx="16" fill="url(#zorb_svg__a)"></rect>
            <defs>
              <radialGradient
                id="zorb_svg__a"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(21.287 7.794) scale(24.093)"
              >
                <stop offset="0.156" stopColor="#DCC8D0"></stop>
                <stop offset="0.302" stopColor="#78C8CF"></stop>
                <stop offset="0.427" stopColor="#4D959E"></stop>
                <stop offset="0.557" stopColor="#305EB9"></stop>
                <stop offset="0.797" stopColor="#311F12"></stop>
                <stop offset="0.906" stopColor="#684232"></stop>
                <stop offset="1" stopColor="#2D1C13"></stop>
              </radialGradient>
            </defs>
          </svg>
        </div>
      </a>
    </div>
  )
}

export default ZoraAuctionTag
