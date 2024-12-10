import React, { createContext, useEffect, useState, useCallback } from 'react';

export const GameDataContext = createContext(undefined);

const GameDataProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState(null);
    const [gameMode, setGameMode] = useState("501");
    const [turn, setTurn] = useState();
    const [currentLeg, setCurrentLeg] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [legsToPlay, setLegsToPlay] = useState();
    const [legsToWin, setLegsToWin] = useState();
    const [gameOn, setGameOn] = useState(false);
    const [history, setHistory] = useState({});

    const areAllThrowsComplete = (points) =>
        points.firstThrow !== 0 && points.secondThrow !== 0 && points.thirdThrow !== 0;

    const initializeThrowsForNewLeg = useCallback(() => {
        setCurrentRound(1);
        setCurrentLeg(prevLeg => {
            const newLeg = prevLeg + 1;
            console.log(`Initializing throws for new leg: ${newLeg}`);
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
                    return { ...p, points: newPoints };
                })
            );
            return newLeg;
        });
    }, [gameMode]);

    const updateWonLegs = useCallback((player) => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((p) =>
                p.userName === player.userName ? { ...p, legsWon: (p.legsWon || 0) + 1 } : p
            )
        );
    }, []);

    const checkForWin = useCallback((player) => {
        const amountOfPlayers = players.filter(p => p.userName === player.userName).length;
        let requiredLegsToWin;
        let legsWon;

        /* This part is not working currently
        *
        * If there is 2 players and less than 3 rounds,
        * then the winner is who finishes legsToPlay.
        *
        * If there is 2 player and more than 3 rounds,
        * then winner is who has the majority
        *
        * With 1 player, it stays the same. Always has get the legsToPlay to win.
        *
        * */
        if (legsToPlay > 2) {
            if (amountOfPlayers === 2) {
                legsWon = player.legsWon + 1;
                requiredLegsToWin = Math.ceil(legsToPlay / 2);
            } else {
                legsWon = player.legsWon;
                requiredLegsToWin = legsToPlay;
            }
        } else {
            legsWon = player.legsWon;
            requiredLegsToWin = legsToPlay;
        }

        console.log(`${player.userName} has won the majority of legs: ${legsWon}`);

        if (legsWon >= requiredLegsToWin) {
            console.log(`${player.userName} has won the majority of legs: ${legsWon}`);
            setWinner(player.userName);
            // If user selects to start game quickly (before timeout has completed)
            // then it will show the previous scores for a moment.
            // We need better reset game functionality.
            setGameOn(false);
        } else {
            console.log(`Starting new leg for player: ${player.userName}`);
            initializeThrowsForNewLeg();
        }
    }, [initializeThrowsForNewLeg, legsToPlay, players]);

    const updatePlayerPoints = useCallback((usernameOfThePlayer, pointType, newValue, isDoubleValue) => {
        const updatePoints = (player) => {
            const existingPoints = player.points;
            const updatedPoints = { ...existingPoints, [pointType]: newValue };
            const newTurnPoints =
                (updatedPoints.firstThrow || 0) +
                (updatedPoints.secondThrow || 0) +
                (updatedPoints.thirdThrow || 0);
            const newTotalPoints = player.points.totalPoints - newTurnPoints + updatedPoints.turnPoints;
            updatedPoints.turnPoints = newTurnPoints;
            updatedPoints.totalPoints = newTotalPoints;

            console.log(`Updated Points for ${player.userName}:`, updatedPoints);

            const zeroHasBeenReachedWithDoubleScore = isDoubleValue && updatedPoints.totalPoints === 0;
            const isPlayerBusted = (points) => points.totalPoints <= 0 && !isDoubleValue;

            if (zeroHasBeenReachedWithDoubleScore) {
                console.log(`Zero reached with double score for ${player.userName}`);
                updateWonLegs(player);
                checkForWin(player);
            } else if (isPlayerBusted(updatedPoints)) {
                updatedPoints.totalPoints = existingPoints.totalPoints;
                console.log(`BUST - ${player.userName} remains with ${updatedPoints.totalPoints} points.`);
            }

            if (areAllThrowsComplete(updatedPoints)) moveToNextTurn(usernameOfThePlayer);
            return { ...player, points: updatedPoints };
        };

        const moveToNextTurn = (currentNameOfThePlayer) => {
            setTurn((prevTurn) => {
                const currentPlayerIndex = players.findIndex(
                    (player) => player.userName === currentNameOfThePlayer
                );
                if (currentPlayerIndex !== -1) {
                    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
                    return players[nextPlayerIndex].userName;
                }
                return prevTurn;
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
    }, [checkForWin, players, updateWonLegs]);

    const addPointsToHistory = useCallback(() => {
        const updatedHistory = { ...history };
        players.forEach((p) => {
            const user = p.userName;
            const points = p.points;
            if (!updatedHistory[user]) {
                updatedHistory[user] = [];
            }
            updatedHistory[user].push({
                leg: currentLeg,
                round: currentRound,
                firstThrow: points.firstThrow,
                secondThrow: points.secondThrow,
                thirdThrow: points.thirdThrow,
                turnTotal: points.turnPoints,
                totalPoints: points.totalPoints,
            });
        });
        setHistory(updatedHistory);
    }, [history, players, currentLeg, currentRound]);

    const initializeThrowsForNewRound = useCallback(() => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((p) => ({
                ...p,
                points: {
                    firstThrow: 0,
                    secondThrow: 0,
                    thirdThrow: 0,
                    turnPoints: 0,
                    totalPoints: p.points.totalPoints,
                },
            }))
        );
    }, []);

    useEffect(() => {
        const areAllTurnsComplete = () => players.every(p => areAllThrowsComplete(p.points));

        const waitTime = 3000;

        if (players.length > 0 && areAllTurnsComplete()) {
            console.log(`Preparing for new round, wait ${waitTime / 1000} secs.`);
            const timeoutId = setTimeout(() => {
                addPointsToHistory();
                initializeThrowsForNewRound();
                setCurrentRound((prevRound) => prevRound + 1);
            }, waitTime);

            return () => clearTimeout(timeoutId); // because of those multiple timeouts
        }
    }, [players, addPointsToHistory, initializeThrowsForNewRound]);


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