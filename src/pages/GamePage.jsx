import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './GamePage.css'
import Board from '../components/Board'
import Hand from '../components/Hand'

export default function GamePage({user}) {
  const {gameId} = useParams()

  const [game, setGame] = useState('')

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
  },[gameId])
  
  if (game) {
    return (
      <div className='game-container'>
        {game.scoreboard ? '' : <Turn player={game.player} turn={game.turn} opponent={game.opponent} />}
        <Board board={game.board} player={game.player} />
        {/* {game.scoreboard ? <Scoreboard /> : <Hand hand={hand} />} */}
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