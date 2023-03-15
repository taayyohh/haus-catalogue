import { ReleaseProps } from 'data/query/typings'
import { GetServerSideProps } from 'next'
import { ISitemapField, getServerSideSitemapLegacy } from 'next-sitemap'
import { slugify } from 'utils'

import { getDiscography } from 'modules/song'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { discography } = await getDiscography()
  const d = discography as ReleaseProps[]

  const fields = d?.reduce((acc: ISitemapField[], cv: ReleaseProps) => {
    acc.push({
      loc: `https://lucid.haus/${slugify(cv.metadata.artist)}/${slugify(cv.name)}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.07,
    })

    const exists = acc.find((item) =>
      item.loc.split('/')[3].includes(slugify(cv.metadata.artist))
    )

    if (!exists || exists?.loc.split('/').length === 5) {
      acc.push({
        loc: `https://lucid.haus/${slugify(cv.metadata.artist)}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.07,
      })
    }

    return acc
  }, [])

  return getServerSideSitemapLegacy(ctx, fields)
}

export default function Sitemap() {}
