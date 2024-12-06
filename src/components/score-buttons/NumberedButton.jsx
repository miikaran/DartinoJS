import React from "react";

const numberOfButtons = 20

/* This component represents the score buttons which are numbered. */
const NumberedButton = ({ onClick }) => {
    return (
        <div className="numbered-buttons">
            {Array.from({length: numberOfButtons}, (_, buttonIndex) => (
                <button
                    key={buttonIndex}
                    className="numbered-button"
                    onClick={() => onClick(buttonIndex)}
                >
                    {buttonIndex + 1}
                </button>
            ))}
        </div>
    );
}

export default NumberedButton;