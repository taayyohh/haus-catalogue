import React from 'react'
import {usePlayerStore} from "../../stores/usePlayerStore";

const Player = () => {
    const { addToQueue, queuedMusic } = usePlayerStore((state: any) => state)
    const handleQueue = React.useMemo(() => {

        // console.log('q', queuedMusic)

    }, [queuedMusic])


    return (
        <div>
            {queuedMusic.length > 0 && (
                <audio controls autoPlay>
                    <source src={queuedMusic?.[0]?.audio}  />
                </audio>
            )}

        </div>
    )
}

export default Player
