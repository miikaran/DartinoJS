import React, { createContext, useState } from 'react';

export const GameDataContext = createContext(undefined);

// Currently data is not saved on refresh

const GameDataProvider = ({ children }) => {
    const [points, setPoints] = useState({});
    const [players, setPlayers] = useState([]);

    const availableToSubscribedContextComponents = { points, setPoints, players, setPlayers };

    return (
        <GameDataContext.Provider value={availableToSubscribedContextComponents}>
            {children}
        </GameDataContext.Provider>
    );
}

export default GameDataProvider;