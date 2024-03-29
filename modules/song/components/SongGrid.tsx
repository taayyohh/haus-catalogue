import { ReleaseProps } from 'data/query/typings'
import React from 'react'

import { SongCard } from 'modules/song'

export const SongGrid: React.FC<{ discography: ReleaseProps[] }> = ({ discography }) => {
  return (
    <div className="relative mx-auto flex w-full flex-col bg-[#F9F9F9]">
      {discography?.length > 0 ? (
        <div className="mx-auto w-11/12 border-t">
          <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-4">
            {discography?.map((release: any, i: any) => (
              <SongCard key={i} release={release} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
