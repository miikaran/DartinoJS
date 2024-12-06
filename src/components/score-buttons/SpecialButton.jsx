import React from "react";

const specialButtons = ['Double', 'Triple', 'Out', 'Undo'];

/* This component represents "special" score buttons,
 * meaning those which do not a have a numbered representation.
 */
const SpecialButton = ({ onClick }) => {
    return (
        <div className="special-buttons">
            {specialButtons.map((specialButtonName, buttonIndex) => (
                <button
                    key={buttonIndex}
                    className="special-button"
                    onClick={() => onClick(specialButtonName, true)}
                >
                    {specialButtonName}
                </button>
            ))}
        </div>
    )
}

export default SpecialButton;