import React from "react";

const SPECIALS = ["Double", "Triple", "Out", "Undo"];

const SpecialButton = ({ onClick }) => (
    <div className="special-buttons">
        {SPECIALS.map((special) => (
            <button
                key={special}
                className="special-button"
                onClick={() => onClick(special, true)}
            >
                {special}
            </button>
        ))}
    </div>
);

export default SpecialButton;