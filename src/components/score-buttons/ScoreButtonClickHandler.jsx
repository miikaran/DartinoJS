import React, { useContext } from 'react';
import { GameDataContext } from '../../context/GameDataContext';

const ScoreButtonHandlerComponent = ({ children }) => {
    const { updatePlayerPoints, players, turn } = useContext(GameDataContext);

    let specialValue = null;
    let chosenValue = "";

    const handleClick = (pressedButton, buttonIsSpecial = false) => {
        if (buttonIsSpecial) {
            handleSpecialButton(pressedButton);
            return;
        }

        const numberedValue = getNumberedButtonValue(pressedButton);

        if (specialValue != null && numberedValue !== 0) {
            handleCombinedValue(specialValue, numberedValue);
            return;
        }

        chosenValue = numberedValue;
        updateScores(numberedValue); // Update points directly based on the button click
    };

    const handleUndoButton = (previousSpecialValue) => {
        specialValue = null
        console.log(`${previousSpecialValue} has been undone.`);
    }

    const handleSpecialButton = (button) => {
        const previousSpecialValue = specialValue;
        specialValue = button.charAt(0).toUpperCase();
        if (specialValue === "U") handleUndoButton(previousSpecialValue);
    };

    const handleCombinedValue = (special, numbered) => {
        chosenValue = `${special}${numbered}`;

        const pointsReceived = calculatePoints(special, numbered);
        updateScores(pointsReceived);

        specialValue = null;
    };

    const getNumberedButtonValue = (numberedButtonID) => {
        return parseInt(numberedButtonID) + 1;
    };

    const calculatePoints = (special, numbered) => {
        switch (special) {
            case 'D': return numbered * 2;
            case 'T': return numbered * 3;
            case 'O': return 0; // Out should not be here
            default: throw new Error(`Unrecognized special value: ${special}.`);
        }
    };

    const updateScores = (points) => {
        const player = players.find(p => p.userName === turn);
        if (player) {
            const updatedFirstAvailableThrowKey = findNextEmptyThrow(player.points);

            if (updatedFirstAvailableThrowKey) {
                const turnPoints = player.points.turnPoints || 0;
                const totalPoints = player.points.totalPoints || 0;

                const updatedTurnPoints = turnPoints + points;
                const updatedTotalPoints = totalPoints - points;

                updatePlayerPoints(player.userName, updatedFirstAvailableThrowKey, points);
                updatePlayerPoints(player.userName, "turnPoints", updatedTurnPoints);
                updatePlayerPoints(player.userName, "totalPoints", updatedTotalPoints);
            }
        }
    };

    const findNextEmptyThrow = (points) => {
        if (!points.firstThrow) return "firstThrow";
        if (!points.secondThrow) return "secondThrow";
        if (!points.thirdThrow) return "thirdThrow";
        return null;
    };

    return (
        <div>{children({ onButtonClick: handleClick })}</div>
    );
};

export default ScoreButtonHandlerComponent;