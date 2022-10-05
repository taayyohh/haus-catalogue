import React from 'react'
import PlayButton from "./PlayButton";

const AlbumInner = ({release}: any) => {
    const [isHover, setIsHover] = React.useState<boolean>(false)

    return (
        <div
            className={"relative overflow-hidden"}
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <img src={release?.metadata?.project?.artwork.uri.replace("ipfs://", "https://ipfs.io/ipfs/")} />
            <PlayButton release={release} isHover={isHover} />
        </div>
    )
}

export default AlbumInner