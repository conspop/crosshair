import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './GamePage.css'
import Board from '../components/Board'

export default function GamePage({user}) {
  const {gameId} = useParams()

  const [game, setGame] = useState('')
  const {playerOneName, playerTwoName} = game

  // playerOne is true
  const player = user.username === playerOneName ? true : false

  useEffect(() => {
    const getGame = async () => {
      await axios.get(`/games/${gameId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tokenService.getToken()
        }
      }).then(response => setGame(response.data))
    }
    getGame()
  },[gameId])
  
  if (game) {
    return (
      <div className='game-container'>
        {/* <Turn /> */}
        <Board board={game.board} player={player} />
        {/* <Hand /> */}
      </div>
    )
  } else {
    return ''
  }
}