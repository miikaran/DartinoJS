import "./PlayerCard.css"
import { GameDataContext } from "../context/GameDataContext"
import { useContext } from "react"

const PlayerCard = ({player}) => {
    const { updatePlayerPoints } = useContext(GameDataContext)

    const handlePointChange = (e) => {
        const pointToEdit = e.target.id
        const newValue = parseInt(e.target.value) || 0
        updatePlayerPoints(player.userName, pointToEdit, newValue)
    }

    const PointBox = ({turns}) => {
        return turns.map((turn, index) => (
            <div className="pointBox" key={index}>
                <input
                    value={player["points"][turn]}
                    id={turn}
                    className="pointInput"
                    onChange={handlePointChange}
                />
            </div>
        ));
    }

    return(
        <div className="playerCard">
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