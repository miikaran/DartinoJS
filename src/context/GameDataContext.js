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
    const [legsToWin, setLegsToWin] = useState(null);
    const [gameOn, setGameOn] = useState(false);
    const [history, setHistory] = useState({});
    const [gameOver, setGameOver] = useState(false)
    const playerDataSchema = {
        "userName": null,
        "wonGames": 0,
        "legsWon": 0,
        "points": {
          "turnPoints": 0,
          "totalPoints": gameMode || 501,
          "firstThrow": 0,
          "secondThrow": 0,
          "thirdThrow": 0
        }
      }

    const areAllThrowsComplete = (points) =>
        points.firstThrow !== 0 
        && points.secondThrow !== 0 
        && points.thirdThrow !== 0;

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

    const updateWonGames = useCallback((player) => {
        const updatedWonGames = (player.wonGames || 0) + 1
        player.wonGames = updatedWonGames;
    }, []);

    const updateWonLegs = useCallback((player) => {
        const updatedWonLegs = (player.legsWon || 0) + 1
        player.legsWon = updatedWonLegs;
    }, []);

    const checkForWin = useCallback((player) => {
        if (player.legsWon >= legsToWin) {
            console.log(`${player.userName} has won the majority of legs: ${player.legsWon}`);
            updateWonGames(player)
            setWinner(player.userName);
            // If user selects to start game quickly (before timeout has completed)
            // then it will show the previous scores for a moment.
            // We need better reset game functionality.
            setGameOver(true)
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

            if (areAllThrowsComplete(updatedPoints)) {
                moveToNextTurn(usernameOfThePlayer);
            }
        
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
    }, [checkForWin, players, updateWonLegs, updateWonGames]);

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

    // PRO GAME DATA RESETTING v1
    const playAgain = () => {
        setGameOver(false)
        setHistory({})
        setCurrentLeg(1)
        setCurrentRound(1)
        setWinner(null)
        setGameOn(true)
        setPlayers((prevPlayers) => {
            return prevPlayers.map((player) => {
                console.log(players)
                const schema = {...playerDataSchema}
                schema.userName = player.userName;
                schema.wonGames = player.wonGames;
                schema.legsWon = player.legsWon;
                return schema
            })
        })
    }

    // PRO GAME DATA RESETTING v2
    const resetGameData = () => {
        setGameOver(false)
        setHistory({})
        setLegsToWin(null)
        setLegsToPlay(null)
        setCurrentLeg(0)
        setCurrentRound(0)
        setTurn(null)
        setGameMode("501")
        setPlayers([])
        setWinner(null)
        setGameOn(false)
    }

    useEffect(() => {
        const areAllTurnsComplete = () => players.every(p => areAllThrowsComplete(p.points));

        const waitTime = 500;

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
        history, setHistory,
        playerDataSchema,
        winner, setWinner,
        gameOver, setGameOver,
        resetGameData, playAgain
    };

    return (
        <GameDataContext.Provider value={availableToSubscribedContextComponents}>
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataProvider;