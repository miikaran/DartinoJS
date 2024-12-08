import './App.css';
import { useState, useContext, useRef } from 'react';
import { GameDataContext } from './context/GameDataContext';
import PlayerCard from './components/PlayerCard';
import ScoreButtonGrid from './components/score-buttons/ScoreButtonGrid';
import ContextTestPrints from "./components/ContextTestPrints";

function App() {

  const gameModes = ["501", "301"];
  const minPlayers = 1;
  const playerLimit = 2;
  const legsLimit = 5;
  const {
      players, setPlayers,
      gameMode, setGameMode,
      turn, setTurn,
      currentLeg, setCurrentLeg,
      currentRound, setCurrentRound, 
      legsToPlay, setLegsToPlay,
      legsToWin, setLegsToWin,
      gameOn, setGameOn
  } = useContext(GameDataContext) 

  const playerDataSchema = {
    "userName": null,
    "wonGames": 0,
    "points": {
      "turnPoints": 0,
      "totalPoints": gameMode || 501,
      "firstThrow": 0,
      "secondThrow": 0,
      "thirdThrow": 0
    }
  }

  const [newPlayerInput, setNewPlayerInput] = useState("")
  const [roundCompleted, setRoundCompleted] = useState(false)
  const [invalidPlayerError, setInvalidPlayerError] = useState("")
  const [invalidGameSettings, setInvalidGameSettings] = useState([])
  const playerInputRef = useRef()


  const handleLegsToPlay = (e) => {
    setLegsToPlay(e.target.value)
  }

  const handleGameMode = (e) => {
    setGameMode(e.target.value)
  }

  const ERROR_PLAYER_EXISTS = "Player already exists";
  const ERROR_EMPTY_USERNAME = "Player name cannot be empty";

  const handleNewPlayerInput = (event) => {
    const inputUsername = event.target.value;
    const trimmedUsername = inputUsername.trim();

    if (inputUsername === "") {
      clearInputAndError();
      return;
    }

    if (isDuplicateUsername(trimmedUsername)) {
      setErrorAndClearInput(ERROR_PLAYER_EXISTS);
      return;
    }

    if (isEmptyUsername(trimmedUsername)) {
      setErrorAndClearInput(ERROR_EMPTY_USERNAME);
      return;
    }

    setValidPlayerInput(trimmedUsername);
  };

  const clearInputAndError = () => {
    setNewPlayerInput("");
    setInvalidPlayerError("");
  };

  const setErrorAndClearInput = (errorMessage) => {
    setInvalidPlayerError(errorMessage);
    setNewPlayerInput("");
  };

  const setValidPlayerInput = (username) => {
    setNewPlayerInput(username);
    setInvalidPlayerError("");
  };

  const isDuplicateUsername = (username) => {
    return players.some(player => player.userName === username);
  };

  const isEmptyUsername = (username) => {
    return username === "";
  };

  const emptyInputOnSubmit = () => {
    playerInputRef.current.value = "";
    playerInputRef.current.focus();
  }

  const addPlayer = () => {
    if(players.length >= playerLimit){
      setInvalidPlayerError("Player limit reached!")
      return;
    }
    if(newPlayerInput){
      let currentPlayers = [...players];
      currentPlayers.push({
        ...playerDataSchema,
        userName: newPlayerInput,
      })
      setPlayers(currentPlayers)
      emptyInputOnSubmit()
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
    if(Object.keys(invalidMessages).length > 0){
      setInvalidGameSettings(invalidMessages)
      return false;
    }
    return true;
  }

  const startGame = () => {
    const isValid = validGameSettings()
    if(isValid){
      setGameOn(true)
      setTurn(players[0].userName)
    }
  }

  const getSettingError = (type) => {
    if(type in invalidGameSettings){
      const message = invalidGameSettings[type]
      return <p className="error">{message}</p>
    }
  }

  const generatePlayerCards = () => {
    return players.map((player, index) => {
      return <PlayerCard 
      key={index}
      player={player} />
    })
  }

  if(gameOn){
    return(
      <div className='gameContainer'>
        <div className='flexWrapper'>
          <div className='gameInfo'>
            <div className='gameStatus'>
              <span>Leg: {currentLeg}</span>
              <span>Turn: {turn}</span>
              <span>Round: {currentRound}</span>
            </div>
            <div className='playerCards'>
              {generatePlayerCards()}
            </div>
          </div>
          <ScoreButtonGrid />
        </div>
      </div>
    )
  }

  if(!gameOn){
    return (
      <div className="gameMenuContainer">
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
                ref={playerInputRef}
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
          <ScoreButtonGrid />
        </div>
      </div>
    );
  }
}

export default App;
