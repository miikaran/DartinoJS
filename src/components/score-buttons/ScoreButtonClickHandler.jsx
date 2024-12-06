// ScoreButtonHandlerComponent.jsx
import React, { useContext } from 'react';
import { GameDataContext } from '../../context/GameDataContext';

const ScoreButtonHandlerComponent = ({ children }) => {
    const { setPoints } = useContext(GameDataContext);

    let specialValue = null;
    let chosenValue = "";

    const handleClick = (pressedButton, buttonIsSpecial = false) => {
        if (buttonIsSpecial) {
            handleSpecialButton(pressedButton);
            return;
        }

        const numberedValue = getNumberedButtonValue(pressedButton);

        if (specialValue) {
            handleCombinedValue(specialValue, numberedValue);
            return;
        }

        chosenValue = numberedValue;
    };

    /* Updates the points in context */
    const updatePoints = (pointsReceived) => {
        setPoints(prevPoints => {
            const existingPoints = prevPoints[chosenValue] || 0;
            return { ...prevPoints, [chosenValue]: existingPoints + pointsReceived };
        });
    }

    const handleSpecialButton = (button) => {
        specialValue = button.charAt(0).toUpperCase();
    };

    const handleCombinedValue = (special, numbered) => {
        chosenValue = `${special}${numbered}`;
        console.log(chosenValue);

        try {
            const pointsReceived = calculatePoints(special, numbered);
            updatePoints(pointsReceived);
        } catch (error) {
            console.log(`Error calculating points: ${error.message}`);
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
                return 0; // Handle OUT action
            case 'U':
                return 0; // Handle UNDO action
            default:
                throw new Error(`Unrecognized special value: ${special}.`);
        }
    };

    // Had invalid hooks errors so needed to make this
    // a React component and do this React shit.
    // So now this fucker needs to be used as a wrapper.
    return ( <div> {children({ onButtonClick: handleClick})} </div> );
};

export default ScoreButtonHandlerComponent;