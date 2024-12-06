import './App.css';
import { useState, useRef } from 'react';
import { GameDataContext } from './context/GameContext';
import PlayerCard from './components/PlayerCard';

function App() {

  const gameModes = ["501", "301"];
  const minPlayers = 1;
  const playerLimit = 2;
  const legsLimit = 5;
  const playerDataSchema = {
    "userName": null,
    "totalPoints": 0,
    "legPoints": 0,
    "totalPoints": 0,
    "wonGames": 0,
  }
  
  const [players, setPlayers] = useState([]);
  const [gameMode, setGameMode] = useState()
  const [turn, setTurn] = useState();
  const [legsToPlay, setLegsToPlay] = useState();
  const [legsToWin, setLegsToWin] = useState()
  const [gameOn, setGameOn] = useState(false)

  const [invalidPlayerError, setInvalidPlayerError] = useState()
  const [newPlayerInput, setNewPlayerInput] = useState()
  const [invalidGameSettings, setInvalidGameSettings] = useState([])

  const handleLegsToPlay = (e) => {
    const value = e.target.value;
    setLegsToPlay(value)
  }

  const handleGameMode = (e) => {
    const value = e.target.value;
    setGameMode(value)
  }

  const handleNewPlayerInput = (e) => {
    const newPlayer = e.target.value;
    setNewPlayerInput(newPlayer)
  }

  const addPlayer = (e) => {
    if(players.length >= playerLimit){
      setInvalidPlayerError("Player limit reached!")
      return;
    }
    if(newPlayerInput){
      let currentPlayers = [...players];
      currentPlayers.push({
        ...playerDataSchema,
        "userName": newPlayerInput
      })
      setPlayers(currentPlayers)
    }
  }

  const generateLegOptions = () => {
    const options = []
    for(let i = 0; i <= legsLimit; i++){
      options.push(<option 
        key={i}
        value={i}>{i}</option>)
    }
    return options
  }

  const generateGameModeOptions = () => {
    const options = gameModes.map((mode) => {
      return <option 
      key={mode}
      value={mode}>{mode}</option>
    })
    return options
  }

  const getAddedPlayersComponents = () => {
    return players.map((player, index) => {
      const userName = player.userName
      return(
        <div 
          key={index} 
          className='addedPlayer'
        >{userName}</div>
      )
    })
  }

  const validGameSettings = () => {
    const invalidMessages = []
    if(!gameModes.includes(gameMode)){
      invalidMessages.push("Choose valid game mode")
    } 
    if(!legsToPlay || legsToPlay > legsLimit){
      invalidMessages.push("Choose valid legs amount")
    } 
    if(players.length == 0){
      invalidMessages.push(`Add minimum ${minPlayers} to play`)
    } 
    if(invalidMessages){
      setInvalidGameSettings(invalidMessages)
      return false;
    }
    return true;
  }

  const startGame = () => {
    const isValid = validGameSettings()
    if(isValid){
      console.log("peli alkaa")
    }
  }

  const getSettingErrors = () => {
    return invalidGameSettings.map((message) => {
      return <li>{message}</li>
    })
  }

  return (
    <GameDataContext.Provider value={{
      players, setPlayers, 
      gameMode, setGameMode, 
      turn, setTurn, 
      legsToPlay, setLegsToPlay, 
      legsToWin, setLegsToWin}} 
    >
      <div className="gameContainer">
        <div className="gameSettings">
          <div 
          uniquetype="gameMode"
          className='gameMode'>
            <label>Game mode</label>
            <select 
              onChange={(e) => handleGameMode(e)}>
              {generateGameModeOptions()}
            </select>
          </div>
          <div 
          className="legsToPlay">
            <label>Legs</label>
            <select 
              uniquetype="legsToPlay"
              onChange={(e) => handleLegsToPlay(e)}>
              {generateLegOptions()}
            </select>
          </div>
          <div 
          uniquetype="players"
          className="players">
            <label>Add players</label>
            <div>
              <input 
                onChange={(e) => handleNewPlayerInput(e)} 
                placeholder="user name" 
              />
              <button onClick={addPlayer}>Add</button>
              {
                invalidPlayerError
                && <p className="error">{invalidPlayerError}</p>
              }
            </div>
            <div className="playerList">
              {getAddedPlayersComponents()}
            </div>
          </div>
          <div className="startGameContainer">
            <button 
            onClick={startGame} 
            className="startGameButton"
            >Start game</button>
          </div>
          {
            invalidGameSettings.length > 0
            &&
            <div className="errorContainer">
              <p>Errors detected:</p>
              <ol>
                {getSettingErrors()}
              </ol>
            </div>
          }
        </div>
      </div>

    </GameDataContext.Provider>
  );
}

export default App;
