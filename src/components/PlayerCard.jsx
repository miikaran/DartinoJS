import "./PlayerCard.css"
import { GameDataContext } from "../context/GameDataContext"
import { useContext, useState, useRef, useEffect } from "react"

const HistoryModal = ({userName, setHistoryModal}) => {

    const historyInfoHeaders = ["leg", "round", "turnTotal", "totalPoints"]
    const historyInputHeaders = ["Leg", "Round", "1st", "2nd", "3rd", "Turn total", "Total"]
    const {history, setHistory, setPlayers} = useContext(GameDataContext)
    const modalRef = useRef()
    const [userHistory, setUserHistory] = useState([])

    // Listener for listening clicks outside modal. 
    // Prolly should be in ref xd.
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

    const handleHistoryRecordInput = (event, historyIndex, historyRecord, key) => {
        if (!historyRecord) return;
        const previousValue = historyRecord[key];
        const newValue = parseInt(event.target.value) || previousValue || 0;
        setHistory((prevHistory) => ({
            ...prevHistory,
            [userName]: prevHistory[userName].map((record, index) =>
                index === historyIndex
                ? {
                    ...record,
                    [key]: newValue,
                    ...calculateNewTotalPoints(previousValue, key, newValue, historyRecord),
                    }
                : record
            ),
        }));
        if (history[userName].length > 1) {
            const updatedTotalPoints = updateRemainingHistoryTotalPoints(
                historyIndex, previousValue, newValue
            );
            updatePlayerTotalPoints(
                previousValue, key, newValue, 
                historyRecord, updatedTotalPoints
            );
            return;
        }
        updatePlayerTotalPoints(previousValue, key, newValue, historyRecord);
    };
    
    const updateRemainingHistoryTotalPoints = (historyIndex, previousValue, newValue) => {
        let accumulatedTotalPoints = 0;
        const updatedHistory = history[userName].map((record, index) => {
            if (index >= historyIndex) {
                accumulatedTotalPoints = record.totalPoints + (previousValue - newValue)
                return {
                    ...record, 
                    totalPoints: accumulatedTotalPoints
                };
            }
            return record;
        });
        setHistory((prevHistory) => ({
            ...prevHistory,
            [userName]: updatedHistory,
        }));
        return accumulatedTotalPoints;
    };
    
    const updatePlayerTotalPoints = (
        previousValue, key, newValue,
        historyRecord, updatedTotalPoints = null
    ) => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((player) => {
                if (player.userName !== userName) return player;
                const totalPoints =
                    updatedTotalPoints !== null
                    ? updatedTotalPoints
                    : calculateNewTotalPoints(
                        previousValue,key,newValue,
                        historyRecord,false,"totalPoints"
                    ).totalPoints
                return {
                    ...player,
                    points: {
                        ...player.points,
                        totalPoints,
                    },
                };
            })
        );
    };
    
    const calculateNewTotalPoints = (
        previousValue, key, newValue,
        historyRecord, calculateAll = true, targetKey = ""
    ) => {
        const calculateTotalPoints = (totalKey) => {
            if (["firstThrow", "secondThrow", "thirdThrow"].includes(key)) {
                if (totalKey === "totalPoints") {
                    return historyRecord[totalKey] + (previousValue - newValue)
                } else if (totalKey === "turnTotal") {
                    return historyRecord[totalKey] + (newValue - previousValue)
                }
                return historyRecord[key]
            }
        }
        if (calculateAll) {
            return {
                totalPoints: calculateTotalPoints("totalPoints"),
                turnTotal: calculateTotalPoints("turnTotal"),
            };
        }
        if (!calculateAll && targetKey) {
            return {
                [targetKey]: calculateTotalPoints(targetKey),
            };
        }
    };
    
    const getElementsForHistoryRecords = (historyIndex, history) => {
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
                        maxLength="2"
                        className="historyRecordInput"
                        placeholder={historyInputHeaders[index]}
                        defaultValue={value}
                        onChange={(e) => handleHistoryRecordInput(e, historyIndex, history, key)}
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
                {getElementsForHistoryRecords(index, history)}
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

    const PointBox = ({ turns }) => {
        return turns.map((turn) => {
            const isReadonlyBoxes = turn === "turnPoints" || turn === "totalPoints";
            return (
                <div className="pointBox" key={turn}>
                    <input
                        maxLength={maxPointLength}
                        defaultValue={player["points"][turn]}
                        id={turn}
                        className="pointInput"
                        onChange={handlePointChange}
                        readOnly={isReadonlyBoxes}
                        onBlur={!isReadonlyBoxes ? handlePointChangeOnBlur : undefined}
                    />
                </div>
            );
        });
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