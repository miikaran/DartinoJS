import './App.css';
import { useState, useContext } from 'react';
import { GameDataContext } from './context/GameDataContext';
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

  const {
      players, setPlayers,
      gameMode, setGameMode,
      turn, setTurn,
      legsToPlay, setLegsToPlay,
      legsToWin, setLegsToWin,
      gameOn, setGameOn
  } = useContext(GameDataContext) 

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
    const invalidMessages = {}
    if(!gameModes.includes(gameMode)){
      invalidMessages["mode"] = "Choose valid game mode"
    } 
    if(!legsToPlay || legsToPlay > legsLimit){
      invalidMessages["legs"] = "Choose valid legs amount"
    } 
    if(players.length == 0){
      invalidMessages["players"] = `Add minimum ${minPlayers} to play`
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

  const getSettingError = (type) => {
    if(type in invalidGameSettings){
      const message = invalidGameSettings[type]
      return <p className="error">{message}</p>
    }

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
          uniquetype="mode"
          className='gameMode'>
            {getSettingError("mode")}
            <label>Game mode</label>
            <select 
              onChange={(e) => handleGameMode(e)}>
              {generateGameModeOptions()}
            </select>
          </div>
          <div 
          className="legs">
            {getSettingError("legs")}
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
            {getSettingError("players")}
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
        </div>
      </div>

    </GameDataContext.Provider>
  );
}

export default App;
