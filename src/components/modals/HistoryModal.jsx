import Modal from './Modal'
import { GameDataContext } from "../../context/GameDataContext"
import { useContext, useState, useRef, useEffect } from "react"
import "./HistoryModal.css"

const HistoryModal = ({userName, setHistoryModal}) => {
    const historyInfoHeaders = ["leg", "round", "turnTotal", "totalPoints"]
    const historyInputHeaders = ["Leg", "Round", "1st", "2nd", "3rd", "Turn total", "Total"]
    const {history, setHistory, setPlayers, currentLeg} = useContext(GameDataContext)
    const modalRef = useRef()
    const [userHistory, setUserHistory] = useState([])

    useEffect(() => getAndSetUserHistory(userName), [history])

    const getAndSetUserHistory = () => {
        const data = history[userName]
        data && setUserHistory(data)
    }

    const handleHistoryRecordInput = (
        event, historyIndex, 
        historyRecord, key 
    ) => {
        if (!historyRecord) return;
        const previousValue = historyRecord[key];
        const newValue = parseInt(event.target.value) || previousValue || 0;
        /* 
        Doing multiple same state updates in this function,
        so have to create a base for async reasons
        */
        let updatedHistory = {
            ...history,
            [userName]: history[userName].map((record, index) =>
                index === historyIndex
                ? {
                    ...record,
                    [key]: newValue,
                    ...calculateNewTotalPoints(
                        previousValue, key, 
                        newValue, historyRecord
                    ),
                    }
                : record
            )
        }
        // If more than one history record -> Sync the remaining records
        if (history[userName].length > 1) {
            const [updatedTotalPoints, updatedUserHistory] = updateRemainingHistoryTotalPoints(
                updatedHistory, historyIndex, 
                previousValue, newValue
            )
            updatedHistory[userName] = updatedUserHistory
            updatePlayerTotalPoints(
                previousValue, key, newValue, 
                historyRecord, updatedTotalPoints
            );
        } else {
            updatePlayerTotalPoints(
                previousValue, key, 
                newValue, historyRecord
            );
        }
        setHistory(updatedHistory);
    };
    
    const updateRemainingHistoryTotalPoints = (
        history, historyIndex, 
        previousValue, newValue
    ) => {
        let accumulatedTotalPoints = 0;
        const updatedHistory = history[userName].map((record, index) => {
            if (index > historyIndex) {
                accumulatedTotalPoints = record.totalPoints + (previousValue-newValue)
                return {
                    ...record, 
                    totalPoints: accumulatedTotalPoints
                };
            }
            return record;
        });
        return [accumulatedTotalPoints, updatedHistory]
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
                    className="historyInfoHeaders">
                    {value}
                </td>
            }
            return(
                <td key={index}>
                    <input 
                        maxLength="2"
                        disabled={currentLeg !== history.leg}
                        className={
                            currentLeg !== history.leg 
                            ? "notCurrentLegHistoryInput" 
                            : "historyRecordInput"
                        }
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
            className="historyRecord">
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
        <Modal 
        modalRef={modalRef}
        setModal={setHistoryModal}>
            <div>
                <table className="historyContainer">
                    <thead className="historyTableHeaders">{getHistoryTableHeaders()}</thead>
                    <tbody className="historyTableBody">{getUserHistoryList()}</tbody>
                </table>
            </div>
            <button 
                className="close"
                onClick={() => setHistoryModal(false)}
                >
                X
            </button>
        </Modal>
    )
}

export default HistoryModal;