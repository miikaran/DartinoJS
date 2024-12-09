import React, {createContext, useEffect, useState} from 'react';

export const GameDataContext = createContext(undefined);

const GameDataProvider = ({children}) => {
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState(null);
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

    const updateCurrentLeg = () => {
        const newLeg = currentLeg + 1;
        setCurrentLeg(newLeg);
        return newLeg;
    }

    const initializeThrowsForNewLeg = () => {
        setCurrentRound(1);
        const thisLeg = updateCurrentLeg();
        console.log(`Initializing throws for new leg: ${thisLeg}`);
        setPlayers((prevPlayers) =>
            prevPlayers.map((p) => {
                const newPoints = {
                    firstThrow: 0,
                    secondThrow: 0,
                    thirdThrow: 0,
                    turnPoints: 0,
                    totalPoints: gameMode,
                };
                console.log(`resets for -> ${p.userName}:`, newPoints);
                return {...p, points: newPoints};
            })
        );
    }

    /**
     * @function updatePlayerPoints
     * @description Updates the points for a player's current turn based on the specified point type and value.
     * @param {string} usernameOfThePlayer - Username of the player whose points are being updated.
     * @param {string} pointType - Type of point being updated, for example: firstThrow.
     * @param {number} newValue - New point value to be set for the specified point type.
     */
    const updatePlayerPoints = (usernameOfThePlayer, pointType, newValue) => {
        /**
         * @function updatePlayerPoints
         * @description Updates a player's points based on the latest throws.
         * @param {Object} player - Player object whose points are to be updated.
         * @returns {Object} - New player object with updated points.
         */
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

            /* We love good chunky code that never ends :) */
            // THIS DOESN'T CHECK FOR DOUBLE SCORE FOR WIN (YET)

            const LEG_DIVISOR = 2;
            const hasPlayerWonLeg = (points) => points.totalPoints === 0;
            const isPlayerBusted = (points) => points.totalPoints < 0;
            const calculateLegsToWin = (totalLegsToPlay) => Math.ceil(totalLegsToPlay / LEG_DIVISOR);

            const updateWonLegs = () => {
                setPlayers((prevPlayers) =>
                    prevPlayers.map((p) =>
                        p.userName === player.userName ? { ...p, legsWon: (p.legsWon || 0) + 1 } : p
                    )
                );
            };

            const checkForWin = () => {
                const nextLegsWon = player.legsWon + 1;
                const legsToWin = calculateLegsToWin(legsToPlay);

                if (nextLegsWon >= legsToWin) {
                    console.log(`${player.userName} has won the majority of legs: ${nextLegsWon}`);
                    setWinner(player.userName);
                    // If user selects to start game quickly (before timeout has completed)
                    // then it will show the previous scores for a moment.
                    // We need better reset game functionality.
                    setGameOn(false);
                } else {
                    console.log(`Starting new leg for ${player.userName}`);
                    initializeThrowsForNewLeg();
                }
                return { ...player, points: updatedPoints };
            };

            if (hasPlayerWonLeg(updatedPoints)) {
                updateWonLegs();
                checkForWin();
            } else if (isPlayerBusted(updatedPoints)) {
                updatedPoints.totalPoints = existingPoints.totalPoints;
                console.log(`BUST - ${player.userName} remains with ${updatedPoints.totalPoints} points.`);
            }

            if (areAllThrowsComplete(updatedPoints)) moveToNextTurn(usernameOfThePlayer);
            return {...player, points: updatedPoints};
        };

        /**
         * @function moveToNextTurn
         * @description Moves the game to the next player's turn by updating the current turn state.
         * @param {string} currentNameOfThePlayer - The username of the player who has the current turn.
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

        setPlayers((previousPlayers) =>
            previousPlayers.map((player) => {
                if (player.userName === usernameOfThePlayer) {
                    return updatePoints(player);
                }
                return player;
            })
        );
    };

    const getPlayerPoints = (usernameOfThePlayer) => {
        return players.find((player) => player.userName === usernameOfThePlayer).points;
    }

    const getPlayerTotalPoints = (userName) =>
        players.find((player) => player.userName === userName)?.points.totalPoints || 0;

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

    useEffect(() => {
        const areAllTurnsComplete = () => players.every((p) => areAllThrowsComplete(p.points));

        /**
         * @function addPointsToHistory
         * @description Updates the player's score history by adding the points
         * collected in the current leg and round to a record for each player. If a player
         * does not have an existing history, a new entry is created.
         */
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
                    "firstThrow": points.firstThrow,
                    "secondThrow": points.secondThrow,
                    "thirdThrow": points.thirdThrow,
                    "turnTotal": points.turnPoints,
                    "totalPoints": points.totalPoints 
                })
            })
            setHistory(updatedHistory)
        }

        const waitTime = 3000;

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

        const prepareForNewLeg = () => {
            console.log(`Preparing for new leg, wait ${waitTime / 1000} secs.`);
            setTimeout(() => {
                addPointsToHistory();
                try {
                    initializeThrowsForNewLeg();
                    setCurrentLeg((prevLeg) => prevLeg + 1);
                } catch (error) {
                    console.log(`Error while preparing for new leg: ${error.message}`);
                }
            })
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