import React, {createContext, useEffect, useState} from 'react';

export const GameDataContext = createContext(undefined);

const GameDataProvider = ({children}) => {
    const [players, setPlayers] = useState([]);
    const [gameMode, setGameMode] = useState("501");
    const [turn, setTurn] = useState();
    const [currentLeg, setCurrentLeg] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [legsToPlay, setLegsToPlay] = useState();
    const [legsToWin, setLegsToWin] = useState()
    const [gameOn, setGameOn] = useState(false)
    const [history, setHistory] = useState({})

    const areAllThrowsComplete = (points) =>
        points.firstThrow !== 0 && points.secondThrow !== 0 && points.thirdThrow !== 0;

    const updatePlayerPoints = (usernameOfThePlayer, pointType, newValue) => {
        const updatePoints = (player) => {
            const existingPoints = player.points;
            const updatedPoints = {...existingPoints, [pointType]: newValue};

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
            return {...player, points: updatedPoints};
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
        const getPlayerPoints = (usernameOfThePlayer) => {
            return players.find((player) => player.userName === usernameOfThePlayer).points;
        }

        const getPlayerTotalPoints = (userName) =>
            players.find((player) => player.userName === userName)?.points.totalPoints || 0;

        const areAllTurnsComplete = () => players.every((p) => areAllThrowsComplete(p.points));

        const addPointsToHistory = () => {
            const updatedHistory = {...history}
            players.forEach((p) => {
                const user = p.userName;
                const points = getPlayerPoints(user)
                if (!(user in updatedHistory)) {
                    updatedHistory[user] = []
                }
                updatedHistory[user].push({
                    "leg": currentLeg,
                    "round": currentRound,
                    "first": points.firstThrow,
                    "second": points.secondThrow,
                    "third": points.thirdThrow,
                    "total": points.turnPoints
                })
            })
            setHistory(updatedHistory)
        }

        const initializeThrowsForNewRound = () => {
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
                    return {...p, points: newPoints};
                })
            );
        }

        // Note -> There is no visual feedback. Maybe some UI for this.
        /**
         * A function that prepares the game for a new round after a specified wait time.
         *
         * Currently, it:
         * 1. Adds points to the game's history.
         * 2. Initializes elements for the new round.
         * 3. Updates the current round.
         */
        const prepareForNewRound = () => {
            const waitTime = 3000;
            console.log(`Preparing for new round, wait ${waitTime / 1000} secs.`);
            setTimeout(() => {
                addPointsToHistory();
                try {
                    initializeThrowsForNewRound();
                    setCurrentRound((prevRound) => prevRound + 1);
                } catch (error) {
                    console.log(`Error while preparing for new round: ${error.message}`);
                }
            }, waitTime);
        }

        const allPlayersHaveFinishedTheirThrows = players.length > 0 && areAllTurnsComplete()
        if (allPlayersHaveFinishedTheirThrows) prepareForNewRound()
    }, [currentLeg, currentRound, history, players]);

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
        history, setHistory
    };

    return (
        <GameDataContext.Provider value={availableToSubscribedContextComponents}>
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataProvider;