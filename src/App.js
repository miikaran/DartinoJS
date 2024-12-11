import './App.css';
import { useState, useContext, useRef } from 'react';
import { GameDataContext } from './context/GameDataContext';
import PlayerCard from './components/PlayerCard';
import ScoreButtonGrid from './components/score-buttons/ScoreButtonGrid';
import GameOverModal from './components/modals/GameOverModal';

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
      setLegsToWin,
      gameOn, setGameOn,
      playerDataSchema,
      winner, setWinner,
      gameOver, setGameOver,
      setHistory
  } = useContext(GameDataContext) 

  const ERROR_PLAYER_EXISTS = "Player already exists";
  const ERROR_EMPTY_USERNAME = "Player name cannot be empty";

  const [newPlayerInput, setNewPlayerInput] = useState("")
  const [invalidPlayerError, setInvalidPlayerError] = useState("")
  const [invalidGameSettings, setInvalidGameSettings] = useState([])
  const playerInputRef = useRef()

  const handleLegsToPlay = (e) => {
    setLegsToPlay(e.target.value)
  }

  const handleGameMode = (e) => {
    setGameMode(e.target.value)
  }

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
    setNewPlayerInput("")
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
      value={mode}>{mode} UP</option>
    })
    return options
  }

  const removeAddedPlayer = (player) => {
    const userName = player.userName
    const isAdded = players.some((p) => p.userName === userName)
    if(isAdded){
      players.length <= playerLimit && setInvalidPlayerError("")
      const removableIndex = players.findIndex(p => p.userName === userName)
      const updatedPlayers = [...players]
      updatedPlayers.splice(removableIndex, 1)
      setPlayers(updatedPlayers)
    }
  }

  const getAddedPlayersComponents = () => {
    return players.map((player, index) => {
      const userName = player.userName
      return(
        <div 
          key={index} 
          className='addedPlayer'>
          {userName}
          <button 
            onClick={() => removeAddedPlayer(player)}
          >X</button>
        </div>
      )
    })
  }

  const validGameSettings = () => {
    const invalidMessages = {}
    if(!gameModes.includes(gameMode)){
      invalidMessages["mode"] = "Choose valid game mode"
    } 
    if(!legsToPlay || (legsToPlay > legsLimit) || (legsToPlay < 1)){
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
      countLegsToWin(legsToPlay)
      setInvalidGameSettings([])
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

  const countLegsToWin = (chosenLegAmount) => {
      setLegsToWin(() => 
        chosenLegAmount % 2 == 0 
        ? (chosenLegAmount / 2) + 1
        : Math.ceil(chosenLegAmount/2)
    )
  }

  const playAgain = () => {
    setGameOver(false)
    setHistory({})
    setCurrentLeg(1)
    setCurrentRound(1)
    setWinner(null)
    setGameOn(true)
    setPlayers((prevPlayers) => {
        return prevPlayers.map((player) => {
            console.log(players)
            const schema = {...playerDataSchema}
            schema.userName = player.userName;
            schema.wonGames = player.wonGames;
            schema.legsWon = player.legsWon;
            return schema
        })
    })
  }


  if(gameOn || gameOver){
    return(
      <div className='gameContainer'>
        {
          winner && gameOver
          && <GameOverModal 
          setGameOverModal={setGameOver}
          playAgain={playAgain}  />
        }
        <div className='flexWrapper'>
            <div className='gameStatusWrapper'>
              <div className='gameStatus'>
                <span>Leg: {currentLeg}</span>
                <span>Turn: {turn}</span>
                <span>Round: {currentRound}</span>
              </div>
            </div>
            <div className='gameInfoWrapper'>
              <div className='gameInfo'>
                <div className='playerCards'>
                  {generatePlayerCards()}
                </div>
              </div>
              <ScoreButtonGrid />
            </div>
          </div>
      </div>
    )
  } else {
    return (
      <div className="gameMenuContainer">
        <div className='gameHeader'>
          Welcome to dartino!
        </div>
        <div className="gameSettings">
          <div 
          uniquetype="mode"
          className='gameOption'>
            <label>Game mode</label>
            <select 
              onChange={(e) => handleGameMode(e)}>
              {generateGameModeOptions()}
            </select>
            {getSettingError("mode")}
          </div>
          <div 
          className="gameOption">
            <label>Legs</label>
            <select 
              uniquetype="legsToPlay"
              onChange={(e) => handleLegsToPlay(e)}>
              {generateLegOptions()}
            </select>
            {getSettingError("legs")}
          </div>
          <div 
          uniquetype="players"
          className="players gameOption">
            <label>Add players</label>
            <input 
              className='addInput'
              ref={playerInputRef}
              onChange={(e) => handleNewPlayerInput(e)} 
              placeholder="Player name" 
            />
            <button className='addPlayer' onClick={addPlayer}>Add</button>
            <div className="playerList">
              {getAddedPlayersComponents()}
            </div>
            {
              invalidPlayerError
              && <p className="error">{invalidPlayerError}</p>
            }
            {getSettingError("players")}
          </div>
          <div className="startGameContainer">
            <button 
            onClick={startGame} 
            className="startGameButton"
            >Start game</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
