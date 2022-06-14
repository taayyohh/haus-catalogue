import create from "zustand"

interface PlayerState {
    queuedMusic:[];
    addToQueue: (songs: []) => void;
}

export const usePlayerStore = create<PlayerState>(set => ({
    queuedMusic: [],
    addToQueue: (songs: []) => {
        set((state) => ({
            queuedMusic: [
                ...songs
            ],
        }))
    }
}))
