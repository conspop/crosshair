import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

export default function App() {
  
  const [gameOn, setGameOn] = useState(false)
  const [hand, setHand] = useState('')
  const [board, setBoard] = useState('')

  const refreshState = (data) => {
    console.log('refreshing!')
  }
  
  return (
    <CreateOrJoinGame refreshState={refreshState} />
  )
} 

function CreateOrJoinGame({refreshState}) {
  const [username, setUsername] = useState('')

  const createGame = () => {
    axios.post('/games', {
      username
    })
    .then(res => refreshState(res.data))
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

// function GameBoard() {
//   return (

//   )
// }
