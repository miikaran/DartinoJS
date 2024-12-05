import "./PlayerCard.css"

const PlayerCard = ({player, setPlayerData}) => {

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
                    <p className="point">{player[turn]}</p>
                    <input 
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
                <PointBox turns={["first", "second", "third"]} />
                <span className="pointSigns">=</span>
                <PointBox turns={["turnPoints"]} />
                <span className="pointSigns">→</span>
                <PointBox turns={["totalPoints"]} />
            </div>
        </div>
    )
}

export default PlayerCard;