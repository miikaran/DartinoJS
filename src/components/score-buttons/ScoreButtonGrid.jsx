import React from 'react';
import SpecialButton from "./SpecialButton";
import NumberedButton from "./NumberedButton";
import './ScoreButtonGridStyles.css';
import ScoreButtonClickHandler from "./ScoreButtonClickHandler";

/* This is base for the score grid formed by buttons */
const ScoreButtonGrid = () => {
    return (
        <div className={"score-button-grid"}>
            <NumberedButton onClick={(id) => ScoreButtonClickHandler(id, false)} />
            <SpecialButton onClick={(value) => ScoreButtonClickHandler(value, true)} />
        </div>
    );
};

export default ScoreButtonGrid;
