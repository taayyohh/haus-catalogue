import { AddressType } from 'typechain'

export interface ZoraAddresses {
  AsksOmnibus?: AddressType
  AsksV1?: AddressType
  AsksCoreEth?: AddressType
  AsksPrivateEth?: AddressType
  AsksV1_1: AddressType
  ERC20TransferHelper: AddressType
  ERC721TransferHelper: AddressType
  OffersV1: AddressType
  ReserveAuctionCoreErc20: AddressType
  ReserveAuctionCoreEth: AddressType
  ReserveAuctionFindersErc20: AddressType
  ReserveAuctionFindersEth: AddressType
  ReserveAuctionListingErc20: AddressType
  ReserveAuctionListingEth: AddressType
  RoyaltyEngineV1: AddressType
  WETH: AddressType
  ZoraModuleManager: AddressType
  ZoraProtocolFeeSettings: AddressType
}

export const HAUS_CATALOGUE_PROXY =
  {
    1: '0xbeff7dd438d3079f146b249552512baf7a1f8e75',
    5: '0x3da452152183140f1eb94b55a86f1671d51d63f4',
  }[process.env.NEXT_PUBLIC_CHAIN_ID || 1] || ''

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const RESERVE_AUCTION_CORE_ETH =
  {
    1: '0x5f7072E1fA7c01dfAc7Cf54289621AFAaD2184d0',
    5: '0x5f7072E1fA7c01dfAc7Cf54289621AFAaD2184d0',
  }[process.env.NEXT_PUBLIC_CHAIN_ID || 1] || ''

export const ZORA_V3_ADDRESSES_1: ZoraAddresses = {
  RoyaltyEngineV1: '0x0385603ab55642cb4dd5de3ae9e306809991804f' as unknown as AddressType,
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as unknown as AddressType,
  ZoraProtocolFeeSettings:
    '0x9641169A1374b77E052E1001c5a096C29Cd67d35' as unknown as AddressType,
  ZoraModuleManager:
    '0x850A7c6fE2CF48eea1393554C8A3bA23f20CC401' as unknown as AddressType,
  ERC20TransferHelper:
    '0xCCA379FDF4Beda63c4bB0e2A3179Ae62c8716794' as unknown as AddressType,
  ERC721TransferHelper:
    '0x909e9efE4D87d1a6018C2065aE642b6D0447bc91' as unknown as AddressType,
  AsksV1: '0xCe6cEf2A9028e1C3B21647ae3B4251038109f42a' as unknown as AddressType,
  AsksV1_1: '0x6170B3C3A54C3d8c854934cBC314eD479b2B29A3' as unknown as AddressType,
  AsksCoreEth: '0x34Aa9CBb80dc0b3d82D04900C02FB81468DafcAb' as unknown as AddressType,
  AsksPrivateEth: '0xfbf87e6c2c242d0166E2Ddb60Db5A94cD4dAe00e' as unknown as AddressType,
  OffersV1: '0x76744367ae5a056381868f716bdf0b13ae1aeaa3' as unknown as AddressType,
  ReserveAuctionCoreEth:
    '0x5f7072E1fA7c01dfAc7Cf54289621AFAaD2184d0' as unknown as AddressType,
  ReserveAuctionCoreErc20:
    '0x53172d999a299198a935f9E424f9f8544e3d4292' as unknown as AddressType,
  ReserveAuctionFindersEth:
    '0x9458E29713B98BF452ee9B2C099289f533A5F377' as unknown as AddressType,
  ReserveAuctionFindersErc20:
    '0xd1adAF05575295710dE1145c3c9427c364A70a7f' as unknown as AddressType,
  ReserveAuctionListingEth:
    '0x1E58bE778aCae2744c1185ea1cE542f304860B96' as unknown as AddressType,
  ReserveAuctionListingErc20:
    '0x1e009dEC13A2A441b3Aa133Bd320FF5B16B22E71' as unknown as AddressType,
}

export const ZORA_V3_ADDRESSES_5: ZoraAddresses = {
  AsksOmnibus: '0x88eECe2AeA8c53dC6862617B3a9A3cB0295E2C6e' as unknown as AddressType,
  AsksV1_1: '0xd8be3E8A8648c4547F06E607174BAC36f5684756' as unknown as AddressType,
  ERC20TransferHelper:
    '0x53172d999a299198a935f9E424f9f8544e3d4292' as unknown as AddressType,
  ERC721TransferHelper:
    '0xd1adAF05575295710dE1145c3c9427c364A70a7f' as unknown as AddressType,
  OffersV1: '0x3a98377E8e67D01a3D21E30eCE6A4703eeB4d25a' as unknown as AddressType,
  ReserveAuctionCoreErc20:
    '0x1ee71c10e7dd6c7fbdc891de4e902e041e1f5d33' as unknown as AddressType,
  ReserveAuctionCoreEth:
    '0x2506d9f5a2b0e1a2619bcce01cd3e7c289a13163' as unknown as AddressType,
  ReserveAuctionFindersErc20:
    '0x36ab5200426715a9dd414513912970cb7d659b3c' as unknown as AddressType,
  ReserveAuctionFindersEth:
    '0x29a6237e646a5a189db197a48cb96fa7944a32a2' as unknown as AddressType,
  ReserveAuctionListingErc20:
    '0x517f7721f3c3762f7048e03919761e027d900082' as unknown as AddressType,
  ReserveAuctionListingEth:
    '0xfcebe0788d5772df2cbcf5079815de98a4d62b09' as unknown as AddressType,
  RoyaltyEngineV1: '0xe7c9Cb6D966f76f3B5142167088927Bf34966a1f' as unknown as AddressType,
  WETH: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' as unknown as AddressType,
  ZoraModuleManager:
    '0x9458E29713B98BF452ee9B2C099289f533A5F377' as unknown as AddressType,
  ZoraProtocolFeeSettings:
    '0x5f7072E1fA7c01dfAc7Cf54289621AFAaD2184d0' as unknown as AddressType,
}

export const ZORA_V3_ADDRESSES: ZoraAddresses | undefined = {
  1: ZORA_V3_ADDRESSES_1,
  5: ZORA_V3_ADDRESSES_5,
}[process.env.NEXT_PUBLIC_CHAIN_ID || 1]

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
