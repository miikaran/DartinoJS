import React from "react";

const NumberedButton = ({ onClick }) => (
    <div className="numbered-buttons">
        {Array.from({ length: 20 }, (_, index) => (
            <button key={index} className="numbered-button" onClick={() => onClick(index)}>
                {index + 1}
            </button>
        ))}
    </div>
);

export default NumberedButton;