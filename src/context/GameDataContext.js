import React, {createContext, useEffect, useState} from 'react';

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

    // This is a monster and will refactor later and move it
    /* responsible for updating the points */
    const updatePlayerPoints = (usernameOfThePlayer, pointType, newValue) => {
        const areAllThrowsComplete = (points) =>
            points.firstThrow !== 0 && points.secondThrow !== 0 && points.thirdThrow !== 0;

        const updatePoints = (player) => {
            const updatedPoints = { ...player.points, [pointType]: newValue };
            if (areAllThrowsComplete(updatedPoints)) moveToNextTurn(usernameOfThePlayer);
            return {...player, points: updatedPoints};
        };

        /**
         * Identifies the current player based on their username,
         * determines the next player, and updates the game state
         * for current user with turn.
         *
         * @param {string} currentNameOfThePlayer - Username of the current player whose turn is ending.
         */
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

        setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
                player.userName === usernameOfThePlayer ? updatePoints(player) : player
            )
        );
    };

    // To clear the fields
    // This should have a timer for like 2 secs
    // and then show something to the users that next round is starting
    useEffect(() => {
        const areAllTurnsComplete = () => {
            return players.every((p) => {
                const { firstThrow, secondThrow, thirdThrow } = p.points;
                return firstThrow !== 0 && secondThrow !== 0 && thirdThrow !== 0;
            });
        };

        if (areAllTurnsComplete()) {
            setPlayers((prevPlayers) => prevPlayers.map((p) => ({
                ...p,
                points: { firstThrow: 0, secondThrow: 0, thirdThrow: 0 }
            })));
        }
    }, [players, setPlayers]);

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