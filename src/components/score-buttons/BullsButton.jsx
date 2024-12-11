import React from "react";

const BULLS = [
    { label: "Outer Bull", points: 25 },
    { label: "Bulls Eye", points: 50 },
];

const BullsButton = ({ onClick }) => (
    <div className="bullseye-buttons">
        {BULLS.map(({ label, points }) => (
            <button key={label} className="bull-button" onClick={() => onClick(points, true)}>
                {label}
            </button>
        ))}
    </div>
);

export default BullsButton;