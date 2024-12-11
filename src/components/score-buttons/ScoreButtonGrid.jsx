import React from 'react';
import SpecialButton from "./SpecialButton";
import NumberedButton from "./NumberedButton";
import './ScoreButtonGridStyles.css';
import ScoreButtonClickHandler from "./ScoreButtonClickHandler";
import BullsButton from "./BullsButton";

/* This is base for the score grid formed by buttons */
const ScoreButtonGrid = () => {
    return (
        <ScoreButtonClickHandler>
            {({ onButtonClick }) => (
                <div className={"score-button-grid"}>
                    <NumberedButton onClick={(id) => onButtonClick(id, false)} />
                    <SpecialButton onClick={(value) => onButtonClick(value, true)} />
                    <BullsButton onClick={(value) => onButtonClick(value, true)} />
                </div>
            )}
        </ScoreButtonClickHandler>
    );
};

export default ScoreButtonGrid;
