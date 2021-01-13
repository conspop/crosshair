import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

export default function App() {
  
  const [name, setName] = useState('')
  const [gameId, setGameId] = useState('')
  const [playerOneName, setPlayerOneName] = useState('')
  const [playerTwoName, setPlayerTwoName] = useState('')
  const [turn, setTurn] = useState('')
  const [hand, setHand] = useState('')
  const [board, setBoard] = useState('')

  const putNameInState = (name) => {
    setName(name)
  }

  const newGame = (data) => {
    setPlayerOneName(data.playerOneName)
    setPlayerTwoName(data.playerTwoName)
    setHand(data.playerOneHand)
    setBoard(data.board)
    setGameId(data.gameId)
  }
  
  return (
    gameId === ''
    ?
    <CreateOrJoinGame 
      newGame={newGame} 
      putNameInState={putNameInState}
    />
    :
    <Game 
      hand={hand}
      board={board}
    />
  )
} 

function CreateOrJoinGame({newGame, putNameInState}) {
  const [username, setUsername] = useState('')

  const createGame = () => {
    putNameInState(username)
    axios.post('/games', {
      username
    })
    .then(res => {
      newGame(res.data)
    })
    .catch(err => console.log(err.message))
  }

  return (
    <>
      <div>
        <label>Name: </label>
        <input type="text" onChange={event => setUsername(event.target.value)} />
        <button onClick={createGame}>Create Game</button>
      </div>
      <div>
        <label>Name: </label>
        <input />
        <label>Game Id: </label>
        <input />
        <button>Join Game</button>
      </div>
    </>
  )
}

function Game({ hand, board}) {
  return (
    <>
      <div>
        Hand:
        <ul>
          {hand.map(card => <li>{card.number}/{card.suit}</li>)}
        </ul>
      </div>
      <div>
        Board:
        <ul>
          {board.map(card => <li>{card.number}/{card.suit}</li>)}
        </ul>
      </div>
    </>
  )
}
