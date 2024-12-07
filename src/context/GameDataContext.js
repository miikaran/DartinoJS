import React, { createContext, useEffect, useState } from 'react';

export const GameDataContext = createContext(undefined);

const GameDataProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [gameMode, setGameMode] = useState("501");
    const [turn, setTurn] = useState();
    const [currentLeg, setCurrentLeg] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [legsToPlay, setLegsToPlay] = useState();
    const [legsToWin, setLegsToWin] = useState();
    const [gameOn, setGameOn] = useState(false);

    const areAllThrowsComplete = (points) =>
        points.firstThrow !== 0 && points.secondThrow !== 0 && points.thirdThrow !== 0;

    const updatePlayerPoints = (usernameOfThePlayer, pointType, newValue) => {
        const updatePoints = (player) => {
            const existingPoints = player.points;
            const updatedPoints = {...existingPoints, [pointType]: newValue };

            // Calculate the total points for the current turn
            const newTurnPoints =
                (updatedPoints.firstThrow || 0) +
                (updatedPoints.secondThrow || 0) +
                (updatedPoints.thirdThrow || 0);


            // Represents the calculation of a player's new total points.
            const newTotalPoints = player.points.totalPoints - newTurnPoints + updatedPoints.turnPoints;
            updatedPoints.turnPoints = newTurnPoints;
            updatedPoints.totalPoints = newTotalPoints;

            console.log(`Updated Points for ${player["userName"]}:`, updatedPoints); // 4 dbg
            if (areAllThrowsComplete(updatedPoints)) moveToNextTurn(usernameOfThePlayer);
            return { ...player, points: updatedPoints };
        };


        const moveToNextTurn = (currentNameOfThePlayer) => {
            setPlayers((prevPlayers) => {
                const currentPlayerIndex = prevPlayers.findIndex(
                    (player) => player.userName === currentNameOfThePlayer
                );
                if (currentPlayerIndex === -1) return prevPlayers;
                const nextPlayerIndex = (currentPlayerIndex + 1) % prevPlayers.length;
                const nextPlayer = prevPlayers[nextPlayerIndex];
                setTurn(nextPlayer.userName);
                return prevPlayers;
            });
        };

        setPlayers((previousPlayers) =>
            previousPlayers.map((player) => {
                if (player.userName === usernameOfThePlayer) {
                    return updatePoints(player);
                }
                return player;
            })
        );
    };

    useEffect(() => {
        const getPlayerTotalPoints = (userName) =>
            players.find((player) => player.userName === userName)?.points.totalPoints || 0;

        const areAllTurnsComplete = () => players.every((p) => areAllThrowsComplete(p.points));

        if (players.length > 0 && areAllTurnsComplete()) {
            setPlayers((prevPlayers) =>
                prevPlayers.map((p) => {
                    const newPoints = {
                        firstThrow: 0,
                        secondThrow: 0,
                        thirdThrow: 0,
                        turnPoints: 0,
                        totalPoints: getPlayerTotalPoints(p.userName),
                    };
                    console.log(`resets for -> ${p.userName}:`, newPoints);
                    return { ...p, points: newPoints };
                })
            );
            setCurrentRound((prevRound) => prevRound + 1);
        }
    }, [players]);

    const availableToSubscribedContextComponents = {
        players, setPlayers,
        gameMode, setGameMode,
        turn, setTurn,
        currentLeg, setCurrentLeg,
        currentRound, setCurrentRound,
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
};

export default GameDataProvider;