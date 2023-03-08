import { ReleaseProps } from "data/query/typings"
import {RESERVE_AUCTION_CORE_ETH, ZERO_ADDRESS} from "constants/addresses"

export const sanitizeDiscography = (discography: ReleaseProps[]): ReleaseProps[] =>
  discography.filter(album => {
    return album.owner !== ZERO_ADDRESS && !!album.metadata && album.metadata.owner !== RESERVE_AUCTION_CORE_ETH
  })
