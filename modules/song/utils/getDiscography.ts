import { discographyQuery } from 'data/query/discography'
import { ReleaseProps } from 'data/query/typings'
import { slugify } from 'utils'

import { repairMetadata, sanitizeDiscography } from 'modules/song/index'

const discography = async () => {
  const discography = await discographyQuery()
  const releases: ReleaseProps[] = [
    ...sanitizeDiscography(discography),
    ...(await repairMetadata(discography)),
  ]

  const fallback = releases?.reduce(
    (acc: { [key: string]: ReleaseProps }, cv: ReleaseProps) => {
      acc = { ...acc, [`${slugify(cv.metadata.artist)}/${slugify(cv.name)}`]: cv }

      return acc
    },
    {}
  )

  return {
    fallback,
    discography: releases,
  }
}

export async function getDiscography() {
  let retry = 5
  try {
    return await discography()
  } catch (err: any) {
    if ((err.response.state === 502 || err.response.state === 504) && retry > 0) {
      const timeout = setTimeout(async () => {
        console.log('retry')
        retry--
        return await discography()
      }, 5000)

      clearTimeout(timeout)
    }

    return {
      fallback: [],
      discography: [],
    }
  }
}
