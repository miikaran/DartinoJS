import "./PlayerCard.css"
import { GameDataContext } from "../context/GameDataContext"
import { useContext, useState, useRef, useEffect } from "react"

const HistoryModal = ({userName, setHistoryModal}) => {
    const historyInfoHeaders = ["leg", "round"]
    const historyInputHeaders = ["Leg", "Round", "1st", "2nd", "3rd", "Total"]

    const { history, setHistory } = useContext(GameDataContext)
    const modalRef = useRef()
    const [userHistory, setUserHistory] = useState([])

    document.addEventListener("click", (e) => {
        detectClickOutsideModal(e)
    }, true)

    useEffect(() => {
        getAndSetUserHistory(userName)
    }, [history])

    const getAndSetUserHistory = () => {
        for(const [user, data] of Object.entries(history)){
            if(user == userName){
                setUserHistory(data);
                break;
            }
        }
    }

    const detectClickOutsideModal = (e) => {
        const modalElement = modalRef.current
        if(modalElement && !modalElement.contains(e.target)){
            setHistoryModal(false)
        }
    }

    const getElementsForHistoryRecords = (history) => {
        return Object.entries(history).map(([key,value], index) => {
            if(historyInfoHeaders.includes(key)){
                return <td 
                    key={index} 
                    className="historyInfoHeaders">{value}
                </td>
            }
            return(
                <td key={index}>
                    <input 
                        className="historyRecordInput"
                        placeholder={historyInputHeaders[index]}
                        defaultValue={value}
                    />
                </td>
            )
        })
    };
    
    const getUserHistoryList = () => {
        return userHistory.map((history, index) => (
            <tr 
                key={index}
                className="historyRecord"
            >
                {getElementsForHistoryRecords(history)}
            </tr>
        ));
    };
    
    const getHistoryTableHeaders = () => (
        <tr>
            {historyInputHeaders.map((header) => (
                <th 
                className="historyHeader"
                key={header}>{header}</th>
            ))}
        </tr>
    );

    console.log(history)

    return(
        <div className="historyModal">
            <div 
                ref={modalRef} 
                className="historyModalContent">
                <table className="historyContainer">
                    <thead className="historyTableHeaders">{getHistoryTableHeaders()}</thead>
                    <tbody className="historyTableBody">{getUserHistoryList()}</tbody>
                </table>
                <button 
                    className="close"
                    onClick={() => setHistoryModal(false)}>
                    X
                </button>
            </div>
        </div>
    )
}

const PlayerCard = ({player}) => {
    let pointBoxInput;
    let maxPointLength = 2;

    const { updatePlayerPoints, turn } = useContext(GameDataContext)
    const [historyModal, setHistoryModal] = useState(false)

    const isPlayerTurn = () => turn == player.userName
    const toggleHistoryModal = () => setHistoryModal(!historyModal)
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
            {
                historyModal
                && <HistoryModal 
                    userName={player.userName} 
                    setHistoryModal={setHistoryModal}
                />
            }
            <div className="playerCardTop">
                <span className="userName">🧑 {player.userName}</span>
                <button onClick={toggleHistoryModal}>Edit history</button>
            </div>
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