import "./PlayerCard.css"
import { GameDataContext } from "../context/GameDataContext"
import { useContext } from "react"

const PlayerCard = ({player}) => {
    const { updatePlayerPoints, turn } = useContext(GameDataContext)
    let pointBoxInput;
    let maxPointLength = 2;

    const isPlayerTurn = () => turn == player.userName
    const handlePointChange = (e) => pointBoxInput = e.target.value

    const handlePointChangeOnBlur = (e) => {
        const pointToEdit = e.target.id
        const newValue = parseInt(pointBoxInput) || 0
        updatePlayerPoints(player.userName, pointToEdit, newValue)
    }

    const PointBox = ({turns}) => {
        return turns.map((turn, index) => (
            <div 
            className="pointBox" 
            key={turn}>
                <input
                    maxLength={maxPointLength}
                    defaultValue={player["points"][turn]}
                    id={turn}
                    className="pointInput"
                    onBlur={handlePointChangeOnBlur}
                    onChange={handlePointChange}
                />
            </div>
        ));
    }

    return(
        <div className={isPlayerTurn() ? "turnHighlight playerCard" : "playerCard"}>
            <span className="userName">🧑 {player.userName}</span>
            <div className="playerPoints">
                <PointBox turns={["firstThrow", "secondThrow", "thirdThrow"]} />
                <span className="pointSigns">=</span>
                <PointBox turns={["turnPoints"]} />
                <span className="pointSigns">→</span>
                <PointBox turns={["totalPoints"]} />
            </div>
        </div>
    )
}

export default PlayerCard;