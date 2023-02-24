import { ReleaseProps } from "data/query/typings"
import { ZERO_ADDRESS } from "utils/helpers"
import { RESERVE_AUCTION_CORE_ETH } from "constants/addresses"

export const filteredDiscography = (discography: ReleaseProps[]) =>
  discography.filter(album => {
    return album.owner !== ZERO_ADDRESS && !!album.metadata && album.metadata.owner !== RESERVE_AUCTION_CORE_ETH
  })
