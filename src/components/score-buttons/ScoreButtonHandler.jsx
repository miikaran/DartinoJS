import { useContext, useState } from "react";
import { GameDataContext } from "../../context/GameDataContext";

const ScoreButtonHandler = () => {
    const { updatePlayerPoints, players, turn } = useContext(GameDataContext);
    const [activeSpecial, setActiveSpecial] = useState(null);

    const handleClick = (buttonValue, isSpecial = false) => {
        if (isSpecial) handleSpecial(buttonValue);
        else handleNumber(buttonValue);
    };

    const handleSpecial = (button) => {
        if (typeof button === "number") {
            updateScores(button);
            setActiveSpecial(null);
            return;
        }

        const specialKey = button.charAt(0).toUpperCase();
        if (specialKey === "U") {
            handleUndo();
        } else if (specialKey === "D" || specialKey === "T" || specialKey === "O") {
            setActiveSpecial(specialKey);
        } else {
            console.warn(`Unhandled special button: ${button}`);
        }
    };

    const handleNumber = (number) => {
        const numericValue = number + 1;

        if (activeSpecial) {
            const points = calculatePoints(activeSpecial, numericValue);
            updateScores(points, activeSpecial === "D");
            setActiveSpecial(null);
        } else {
            updateScores(numericValue);
        }
    };

    const handleUndo = () => {
        console.log("Undo action triggered.");
        setActiveSpecial(null);
    };

    const calculatePoints = (special, number) => {
        switch (special) {
            case "D": return number * 2;
            case "T": return number * 3;
            case "O": return 0;
            default: throw new Error(`Unknown special action: ${special}`);
        }
    };

    const updateScores = (points, isDouble = false) => {
        const currentPlayer = players.find((player) => player.userName === turn);
        if (!currentPlayer) return;

        const throwKey = findNextEmptyThrow(currentPlayer.points);
        if (throwKey) {
            const newTurnPoints = (currentPlayer.points.turnPoints || 0) + points;
            const newTotalPoints = (currentPlayer.points.totalPoints || 0) - points;

            updatePlayerPoints(currentPlayer.userName, throwKey, points, isDouble);
            updatePlayerPoints(currentPlayer.userName, "turnPoints", newTurnPoints);
            updatePlayerPoints(currentPlayer.userName, "totalPoints", newTotalPoints);
        }
    };

    const findNextEmptyThrow = (points) => {
        if (!points.firstThrow) return "firstThrow";
        if (!points.secondThrow) return "secondThrow";
        if (!points.thirdThrow) return "thirdThrow";
        return null;
    };

    return { onButtonClick: handleClick };
};

export default ScoreButtonHandler;