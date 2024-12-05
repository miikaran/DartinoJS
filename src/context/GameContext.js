import { createContext } from "react";

export const GameDataContext = createContext({
    players: null,
    setPlayers: () => {},
    gameMode: null,
})

