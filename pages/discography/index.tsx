import React from "react"
import { discographyQuery } from "query/discography"
import Album from "./Album/Album"

const Discography: React.FC<any> = ({ discography }) => {
  return (
    <div>
      <div className="relative mx-auto flex w-full flex-col bg-rose-200 py-24">
        {discography?.length > 0 ? (
          <div className="mx-auto w-11/12">
            <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-4">
              {discography?.map((release: any, i: any) => (
                <Album key={i} release={release} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Discography

export async function getStaticProps() {
  try {
    // zora api queries
    const discography = await discographyQuery()
    return {
      props: {
        discography,
      },
    }
  } catch (error: any) {
    console.log("err", error)
    return {
      notFound: true,
    }
  }
}
