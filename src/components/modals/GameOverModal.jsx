import { GameDataContext } from "../../context/GameDataContext"
import { useContext, useRef } from "react"
import Modal from "./Modal"
import "./GameOverModal.css"

const GameOverModal = ({setGameOverModal}) => {
    const {winner, players, resetGameData, playAgain} = useContext(GameDataContext)
    const gameOverModalRef = useRef()

    const getPlayersStats = () => {
        return players.map((player, index) => {
            return (
                <div
                key={index}
                >
                    <h3>{player.userName}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Won legs</th>
                                <th>Won games</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{player.legsWon}</td>
                                <td>{player.wonGames}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        })
    }

    return(
        <Modal
        modalRef={gameOverModalRef}
        setModal={setGameOverModal}
        >
        <div className="gameOverModalContainer">
            <h3>Game over! Winner is {winner}</h3>
            <div className="stats">{getPlayersStats()}</div>
            <div className="gameOverOptions">
                <button 
                className="gameOverButtons" 
                onClick={() => resetGameData()}
                >Back to menu</button>
                <button 
                className="gameOverButtons" 
                onClick={() => playAgain()}
                >Play again</button>
            </div>
        </div>
        </Modal>
    )
}

export default GameOverModal