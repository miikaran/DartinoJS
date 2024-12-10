import React, {useContext} from 'react';
import {GameDataContext} from '../../context/GameDataContext';

const ScoreButtonHandlerComponent = ({children}) => {
    const {updatePlayerPoints, players, turn} = useContext(GameDataContext);

    let specialValue = null;
    let numberedValue = 0;
    let combinedSpecialAndNumberedValue = "";

    const handleClick = (pressedButton, buttonIsSpecial = false) => {
        if (buttonIsSpecial) {
            handleSpecialButton(pressedButton);
            return;
        }

        const selectedNumberedValue = getNumberedButtonValue(pressedButton);

        if (specialValue != null && selectedNumberedValue !== 0) {
            handleCombinedValue(specialValue, selectedNumberedValue);
            return;
        }

        numberedValue = selectedNumberedValue;
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
        combinedSpecialAndNumberedValue = `${special}${numbered}`;

        const pointsReceived = calculatePoints(special, numbered);
        if (special === "D") {
            updateScores(pointsReceived, true);
        } else {
            updateScores(pointsReceived, false);
        }
        specialValue = null;
    };

    const getNumberedButtonValue = (numberedButtonID) => {
        return numberedButtonID + 1;
    };

    const calculatePoints = (special, numbered) => {
        switch (special) {
            case 'D':
                return numbered * 2;
            case 'T':
                return numbered * 3;
            case 'O':
                return 0; // Out should not be here
            default:
                throw new Error(`Unrecognized special value: ${special}.`);
        }
    };

    const updateScores = (points, doubleKey) => {
        const player = players.find(p => p.userName === turn);
        if (player) {
            const updatedFirstAvailableThrowKey = findNextEmptyThrow(player.points);

            if (updatedFirstAvailableThrowKey) {
                const turnPoints = player.points.turnPoints || 0;
                const totalPoints = player.points.totalPoints || 0;

                const updatedTurnPoints = turnPoints + points;
                const updatedTotalPoints = totalPoints - points;

                if (doubleKey) {
                    updatePlayerPoints(player.userName, updatedFirstAvailableThrowKey, points, true);
                    updatePlayerPoints(player.userName, "turnPoints", updatedTurnPoints);
                    updatePlayerPoints(player.userName, "totalPoints", updatedTotalPoints);
                } else {
                    updatePlayerPoints(player.userName, updatedFirstAvailableThrowKey, points, false);
                    updatePlayerPoints(player.userName, "turnPoints", updatedTurnPoints);
                    updatePlayerPoints(player.userName, "totalPoints", updatedTotalPoints);
                }
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
        <div>{children({onButtonClick: handleClick})}</div>
    );
};

export default ScoreButtonHandlerComponent;