import "./PlayerCard.css"
import { GameDataContext } from "../context/GameDataContext"
import { useContext, useState } from "react"
import PointBox from "./PointBox";
import HistoryModal from "./modals/HistoryModal";

const PlayerCard = ({player}) => {
    const { turn, players, history } = useContext(GameDataContext)
    const [historyModal, setHistoryModal] = useState(false)

    const isPlayerTurn = () => turn == player.userName
    const toggleHistoryModal = () => setHistoryModal(!historyModal)

    const getPlayerLegsWon = () => {
        return players.find((targetPlayer) => {
            return player.userName == targetPlayer.userName
        }).legsWon || 0
    }
    return(
        <div className={isPlayerTurn() ? "turnHighlight playerCard" : "playerCard"}>
            {
                historyModal
                && <HistoryModal 
                    userName={player.userName} 
                    setHistoryModal={setHistoryModal}
                />
            }
            <div className="playerCardTop">
                <div className="playerData">
                    <span className="userName">🧑 {player.userName}</span>
                    <div className="legsWon">Legs won: {getPlayerLegsWon()}</div>
                </div>
                {
                    history[player.userName]?.length > 0
                    && <button className="historyButton" onClick={toggleHistoryModal}>View history</button>
                }
            </div>
            <div className="playerPoints">
                <PointBox 
                turns={["firstThrow", "secondThrow", "thirdThrow"]} 
                player={player}
                />
                <span className="pointSigns">=</span>
                <PointBox 
                turns={["turnPoints"]}  
                player={player}
                />
                <span className="pointSigns">→</span>
                <PointBox 
                turns={["totalPoints"]}  
                player={player}
                />
            </div>
        </div>
    )
}

export default PlayerCard;