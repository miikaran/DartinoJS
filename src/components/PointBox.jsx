import { useContext, useState, useEffect } from "react";
import { GameDataContext } from "../context/GameDataContext";

const TURN_POINTS = "turnPoints";
const TOTAL_POINTS = "totalPoints";

const isReadonlyBox = (turn) => turn === TURN_POINTS || turn === TOTAL_POINTS;

const PointBox = ({ turns, player }) => {
    const { updatePlayerPoints } = useContext(GameDataContext);
    const [points, setPoints] = useState({});

    useEffect(() => {
        setPoints(player.points);
    }, [player.points]); // needed so that points render when updates happen

    /**
     * @function handlePointChange
     * @description Callback function that updates the points for a specified turn based on a change e.
     */
    const handlePointChange = (event, turn) => {
        const newValue = event.target.value;
        setPoints((previouslyKnownPoints) => ({ ...previouslyKnownPoints, [turn]: newValue }));
    };

    /**
     * @function handlePointChangeOnBlur
     * @description Handles the change in player points when an input field loses focus.
     */
    const handlePointChangeOnBlur = (event, turn) => {
        const newValue = parseInt(event.target.value, 10) || 0;
        updatePlayerPoints(player.userName, turn, newValue);
    };

    return turns.map((turn) => (
        <div className="pointBox" key={turn}>
            <input
                maxLength={2}
                value={points[turn] || 0}
                id={turn}
                className="pointInput"
                onChange={(e) => handlePointChange(e, turn)}
                readOnly={isReadonlyBox(turn)}
                onBlur={!isReadonlyBox(turn) ? (e) => handlePointChangeOnBlur(e, turn) : undefined}
            />
        </div>
    ));
};

export default PointBox;