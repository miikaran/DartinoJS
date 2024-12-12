import { useContext } from 'react'
import { GameDataContext } from '../context/GameDataContext';
import { getParsedValueByKey } from '../utils/localstorage';

const ScoreBoard = () => {
    const {SCORE_BOARD_RECORDS_KEY} = useContext(GameDataContext)
    const scoreBoardRecords = getParsedValueByKey(SCORE_BOARD_RECORDS_KEY) || []
    /*
    Should probably create the elements dynamically, but this is ok for this i think.
    */
    return (
        <div className='scoreBoard'>
            {
                scoreBoardRecords.length > 0
                ? <table className='scoreRecords'>
                        <thead className='scoreRecordsHead'>
                            <tr>
                                <th>Time</th>
                                <th>Winner</th>
                                <th>Players</th>
                                <th>Rounds won</th>
                                <th>Rounds to win</th>
                            </tr>
                        </thead>
                        <tbody className='scoreRecordsBody'>        
                        {
                            scoreBoardRecords.map((record, index) => {
                                const time = record.time || Date.now().toLocaleString()
                                const winner = record.winner || "Not found"
                                const players = record.players || []
                                const playersWonRounds = record.playersWonRounds || []
                                const roundsToWin = record.roundsToWin || 0
                                return(    
                                    <tr key={index}>
                                        <td>{time}</td>
                                        <td>{winner}</td>
                                        <td>{players.join(", ")}</td>
                                        <td>{playersWonRounds.join(", ")}</td>
                                        <td>{roundsToWin}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                : <></>
            }
        </div>
    )
}

export default ScoreBoard;