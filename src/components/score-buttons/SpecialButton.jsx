import React from "react";

const specialButtons = ['Double', 'Triple', 'Out', 'Undo'];

/* This component represents "special" score buttons,
 * meaning those which do not a have a numbered representation.
 */
const SpecialButton = () => {
    return (
        <div className="special-button">
            {specialButtons.map((specialButtonName, buttonIndex) => (
                <button key={buttonIndex} className="special-button">
                    {specialButtonName}
                </button>
            ))}
        </div>
    )
}

export default SpecialButton;