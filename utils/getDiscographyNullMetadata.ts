import { discographyQuery } from "data/query/discography"
import { slugify } from "./helpers"
import { ReleaseProps } from "data/query/typings"

export async function getDiscography() {
  const discography = await discographyQuery()

  const fallback = discography?.reduce((acc: { [key: string]: ReleaseProps }, cv: ReleaseProps) => {
    if (!!cv.metadata.artist && !!cv.name) {
      acc = { ...acc, [`${slugify(cv.metadata.artist)}/${slugify(cv.name)}`]: cv }
    }

    return acc
  }, {})

  return {
    fallback,
    discography,
  }
}
