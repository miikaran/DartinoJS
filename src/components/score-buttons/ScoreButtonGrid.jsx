import React from "react";
import SpecialButton from "./SpecialButton";
import NumberedButton from "./NumberedButton";
import BullsButton from "./BullsButton";
import "./ScoreButtonGridStyles.css";
import ScoreButtonHandlerComponent from "./ScoreButtonHandler";

const ScoreButtonGrid = () => {
    const { onButtonClick } = ScoreButtonHandlerComponent();

    return (
        <div className="score-button-grid">
            <NumberedButton onClick={(id) => onButtonClick(id, false)} />
            <SpecialButton onClick={(value) => onButtonClick(value, true)} />
            <BullsButton onClick={(value) => onButtonClick(value, true)} />
        </div>
    );
};

export default ScoreButtonGrid;