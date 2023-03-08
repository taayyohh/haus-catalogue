import { discographyQuery } from 'data/query/discography'
import { ReleaseProps } from 'data/query/typings'
import { sanitizeDiscography, repairMetadata } from 'modules/song/index'
import { slugify } from 'utils'

export async function getDiscography() {
  try {
    const discography = [
      ...sanitizeDiscography(await discographyQuery()),
      ...(await repairMetadata(await discographyQuery())),
    ]

    const fallback = discography?.reduce(
      (acc: { [key: string]: ReleaseProps }, cv: ReleaseProps) => {
        acc = { ...acc, [`${slugify(cv.metadata.artist)}/${slugify(cv.name)}`]: cv }

        return acc
      },
      {}
    )

    return {
      fallback,
      discography,
    }
  } catch (err) {
    console.log('e', err)
    return {
      fallback: [],
      discography: [],
    }
  }
}
