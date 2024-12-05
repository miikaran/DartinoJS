import React from 'react';
import SpecialButton from "./SpecialButton";
import NumberedButton from "./NumberedButton";

/* This is base for the score grid formed by buttons */
const ScoreButtonGrid = () => {
    return (
        <div className={"score-button-grid"}>
            <NumberedButton/>
            <SpecialButton/>
        </div>
    );
};

export default ScoreButtonGrid;
