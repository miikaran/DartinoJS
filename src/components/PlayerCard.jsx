import "./PlayerCard.css"
import { GameDataContext } from "../context/GameDataContext"
import { useContext } from "react"

const PlayerCard = ({player}) => {

    const {points, setPlayerData} = useContext(GameDataContext)

    const updatePlayerPoints = (e) => {
        const pointToEdit = e.target.id
        const newValue = parseInt(e.target.value) || 0
        setPlayerData((prev) => 
            prev.map((p) =>
                p.userName === player.userName
                    ? { ...p, [pointToEdit]: newValue }
                    : p
            )
        );
    }

    const PointBox = ({turns}) => {
        return turns.map((turn, index) => {
            return (
                <div className="pointBox">
                    <input 
                        value={player["points"][turn]}
                        key={index}
                        id={turns[index]}
                        className="pointInput" 
                        onChange={(e) => updatePlayerPoints(e)} 
                        />
                </div>
            )
        })
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