import React, { createContext, useState } from 'react';

export const GameDataContext = createContext(undefined);

// Currently data is not saved on refresh

const GameDataProvider = ({ children }) => {

    const [points, setPoints] = useState({});
    const [players, setPlayers] = useState([]);
    const [gameMode, setGameMode] = useState()
    const [turn, setTurn] = useState();
    const [currentLeg, setCurrentLeg] = useState()
    const [legsToPlay, setLegsToPlay] = useState();
    const [legsToWin, setLegsToWin] = useState()
    const [gameOn, setGameOn] = useState(false)

    const availableToSubscribedContextComponents = { 
        points, setPoints,
        players, setPlayers,
        gameMode, setGameMode,
        turn, setTurn,
        currentLeg, setCurrentLeg,
        legsToPlay, setLegsToPlay,
        legsToWin, setLegsToWin,
        gameOn, setGameOn
    };

    return (
        <GameDataContext.Provider value={availableToSubscribedContextComponents}>
            {children}
        </GameDataContext.Provider>
    );
}

export default GameDataProvider;