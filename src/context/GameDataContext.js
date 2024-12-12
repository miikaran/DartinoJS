import React, {createContext, useCallback, useEffect, useState} from 'react';
import { putParsedValueToStorage, getParsedValueByKey } from '../utils/localstorage';

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
          "firstThrow": "",
          "secondThrow": "",
          "thirdThrow": ""
        }
    }
    const SCORE_BOARD_RECORDS_KEY = "scoreBoard"    

    const areAllThrowsComplete = (points) =>
        points.firstThrow !== ""
        && points.secondThrow !== ""
        && points.thirdThrow !== "";

    const initializeThrowsForNewLeg = useCallback(() => {
        setCurrentRound(1);
        setCurrentLeg(prevLeg => {
            const newLeg = prevLeg + 1;
            console.log(`Initializing throws for new leg: ${newLeg}`);
            setPlayers((prevPlayers) =>
                prevPlayers.map((p) => {
                    const newPoints = {
                        firstThrow: "",
                        secondThrow: "",
                        thirdThrow: "",
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
        player.wonGames = (player.wonGames || 0) + 1;
    }, []);

    const updateWonLegs = useCallback((player) => {
        player.legsWon = (player.legsWon || 0) + 1;
    }, []);

    const updateToLocalStorage = winner => {
        let currStored = getParsedValueByKey(SCORE_BOARD_RECORDS_KEY) || []
        const newRecord = {
             time: new Date().toLocaleString(),
             winner: winner.userName,
             players: players.map((p) => p.userName),
             roundsToWin: legsToWin,
             playersWonRounds: [
                ...players.map((p) => {
                    return p.userName !== winner.userName
                    ? p.legsWon
                    : winner.legsWon
                })
            ]
        }
        currStored 
        ? currStored.push(newRecord) 
        : currStored = [newRecord]
        putParsedValueToStorage(
            SCORE_BOARD_RECORDS_KEY, 
            currStored
        )
    }

    const checkForWin = useCallback((player) => {
        if (player.legsWon >= legsToWin) {
            console.log(`${player.userName} has won the majority of legs: ${player.legsWon}`);
            updateWonGames(player)
            updateToLocalStorage(player)
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
    }, [initializeThrowsForNewLeg, legsToWin, updateWonGames]);

    const updatePlayerPoints = useCallback((usernameOfThePlayer, pointType, newValue, isDoubleValue) => {
        const updatePoints = (player) => {
            const existingPoints = player.points;
            const updatedPoints = { ...existingPoints, [pointType]: newValue };
            const newTurnPoints =
                (updatedPoints.firstThrow === "" ? 0 : Number(updatedPoints.firstThrow)) +
                (updatedPoints.secondThrow === "" ? 0 : Number(updatedPoints.secondThrow)) +
                (updatedPoints.thirdThrow === "" ? 0 : Number(updatedPoints.thirdThrow));
            const newTotalPoints = existingPoints.totalPoints - newTurnPoints + updatedPoints.turnPoints;
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
                    firstThrow: "",
                    secondThrow: "",
                    thirdThrow: "",
                    turnPoints: 0,
                    totalPoints: p.points.totalPoints,
                },
            }))
        );
    }, []);

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
        resetGameData,
        SCORE_BOARD_RECORDS_KEY
    };

    return (
        <GameDataContext.Provider value={availableToSubscribedContextComponents}>
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataProvider;