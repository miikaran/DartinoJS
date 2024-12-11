import React from "react";

const bullseyeButtons = ["Outer Bull", "Bulls Eye"];

/* This component represents the bull buttons */
const BullsButton = ({ onClick }) => {
    return (
        <div className="bullseye-buttons">
            {bullseyeButtons.map((bullsEyeButtonName, buttonIndex) => (
                <button key={buttonIndex} className="bull-button" onClick={() => onClick(bullsEyeButtonName, false)}>
                    {bullsEyeButtonName}
                </button>
            ))}
        </div>
    )
}

export default BullsButton;