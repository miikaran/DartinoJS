import { createContext } from "react";

export const GameDataContext = createContext({
    players: null,
    setPlayers: () => {},
    gameMode: null,
    setGameMode: () => {},
    turn: null,
    setTurn: () => {},
    legsToPlay: null,
    setLegsToPlay: () => {},
    legsToWin: null,
    setLegsToWin: () => {},
    gameOn: null,
    setGameOn: () => {}
})

