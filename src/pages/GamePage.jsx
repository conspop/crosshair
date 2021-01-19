import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './GamePage.css'
import Board from '../components/Board'
import Hand from '../components/Hand'
import Scoreboard from '../components/Scoreboard'

export default function GamePage({user}) {
  const {gameId} = useParams()

  const [game, setGame] = useState('')
  const [selected, setSelected] = useState('')

  const {player, turn, opponent, board, scoreboard, hand} = game
  
  useEffect(() => {
    const getGame = async () => {
      await axios.get(`/games/${gameId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tokenService.getToken()
        }
      }).then(response => {
        const {
          _id, 
          board, 
          playerOneName, 
          playerTwoName,
          playerOneHand, 
          playerTwoHand,
          turn,
          scoreboard
        } = response.data
        const player = playerOneName === user.username ? true : false
        const gameData = {
          _id,
          board,
          player,
          hand: player ? playerOneHand : playerTwoHand,
          opponent: player ? playerTwoName : playerOneName,
          turn,
          scoreboard
        }
        setGame(gameData)
      })
    }
    getGame()
  },[gameId, user.username])

  const handleSelect = (event) => {
    const index = parseInt(event.currentTarget.dataset.index)
    if (selected === index) {
      setSelected('')
    } else {
      setSelected(parseInt(index))
    }
  }

  if (game) {
    return (
      <div className='game-container'>
        {scoreboard ? '' : <Turn player={player} turn={turn} opponent={opponent} />}
        <Board board={board} player={player} />
        {scoreboard ? <Scoreboard scoreboard={scoreboard} /> : <Hand hand={hand} selected={selected} handleSelect={handleSelect} />}
      </div>
    )
  } else {
    return ''
  }
}

function Turn({player, turn, opponent}) {
  if (player === turn) {
    return 'Your Turn'
  } else {
    return `${opponent}'s Turn`
  }
}