import React, { createContext, useState } from 'react';

export const GameDataContext = createContext(undefined);

// Currently data is not saved on refresh

const GameDataProvider = ({ children }) => {

    const [players, setPlayers] = useState([]);
    const [gameMode, setGameMode] = useState()
    const [turn, setTurn] = useState();
    const [currentLeg, setCurrentLeg] = useState()
    const [legsToPlay, setLegsToPlay] = useState();
    const [legsToWin, setLegsToWin] = useState()
    const [gameOn, setGameOn] = useState(false)


    /**
     * Updates a specific type of point for a player identified by their username.
     *
     * @param {string} playerUserName - Username of the player whose points should be updated.
     * @param {string} typeOfPoint - Type of point that needs to be updated.
     * @param {number} updatedValue - New value to assign to the specified type of point.
     */
    const updatePlayerPoints = (playerUserName, typeOfPoint, updatedValue) => {
        const updatePoints = player => ({
            ...player,
            points: {...player.points,  [typeOfPoint]: updatedValue}
        });

        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.userName === playerUserName
                    ? updatePoints(player)
                    : player
            )
        );
    };

    const availableToSubscribedContextComponents = { 
        players, setPlayers,
        gameMode, setGameMode,
        turn, setTurn,
        currentLeg, setCurrentLeg,
        legsToPlay, setLegsToPlay,
        legsToWin, setLegsToWin,
        gameOn, setGameOn,
        updatePlayerPoints,
    };

    return (
        <GameDataContext.Provider value={availableToSubscribedContextComponents}>
            {children}
        </GameDataContext.Provider>
    );
}

export default GameDataProvider;