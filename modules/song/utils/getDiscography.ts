import { discographyQuery } from "data/query/discography"
import { ReleaseProps } from "data/query/typings"
import { sanitizeDiscography, repairMetadata } from "modules/song/index"
import {slugify} from "../../../utils/slugify";

export async function getDiscography() {
  const discography = [
    ...sanitizeDiscography(await discographyQuery()),
    ...(await repairMetadata(await discographyQuery())),
  ]

  const fallback = discography?.reduce((acc: { [key: string]: ReleaseProps }, cv: ReleaseProps) => {
    acc = { ...acc, [`${slugify(cv.metadata.artist)}/${slugify(cv.name)}`]: cv }

    return acc
  }, {})

  return {
    fallback,
    discography,
  }
}
