import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './GamePage.css'
import Board from '../components/Board'
import Hand from '../components/Hand'
import Scoreboard from '../components/Scoreboard'

export default function GamePage({user}) {
  const {gameId} = useParams()

  const [id, setId] = useState('')
  const [board, setBoard] = useState(Array(25).fill(''))
  const [player, setPlayer] = useState('')
  const [hand, setHand] = useState(Array(12).fill(''))
  const [opponent, setOpponent] = useState('')
  const [turn, setTurn] = useState('')
  const [scoreboard, setScoreboard] = useState('')
  const [selected, setSelected] = useState('')


  
  const refresh = useCallback(() => {
    axios.get(`/games/${gameId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokenService.getToken()
      }
    })
    .then(response => {
      const dataPlayer = response.data.playerOneName === user.username ? true : false
      setId(response.data._id)
      setBoard(response.data.board)
      setPlayer(dataPlayer)
      setHand(dataPlayer ? response.data.playerOneHand : response.data.playerTwoHand)
      setOpponent(dataPlayer ? response.data.playerTwoName : response.data.playerOneName)
      setTurn(response.data.turn)
      setScoreboard(response.data.scoreboard)
    })
    .catch(() => console.log('Something went wrong!'))
  },[gameId, user.username])

  // get game data when component first loads
  useEffect(() => {
    refresh()
  },[refresh])

  useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 3000)
    return () => clearInterval(interval)
  })

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    let appContainerEl = document.querySelector('.app-container')
    appContainerEl.style.setProperty('--vh', `${vh}px`)
  },[])

  const handleSelect = (event) => {
    const index = parseInt(event.currentTarget.dataset.index)
    if (player === turn) {
      if (selected === index) {
        setSelected('')
      } else {
        setSelected(parseInt(index))
      }
    }
  }

  const handlePlayCard = (event) => {
    const index = parseInt(event.currentTarget.dataset.index)
    if (board[index] === '') {
      if (selected || selected === 0) {
        // remove card from hand
        const oldHand = [...hand]
        const newHand = [...hand]
        const playedCard = newHand.splice(selected,1)
        setHand(newHand)
  
        // add card to board
        const oldBoard = [...board]
        const newBoard = [...board]
        newBoard[index] = playedCard[0]
        setBoard(newBoard)
        
        setTurn(turn => !turn)
        setSelected('')
  
        const updateObject = {
          token: tokenService.getToken(),
          id,
          [player ? 'playerOneHand' : 'playerTwoHand']: newHand,
          board: newBoard
        }
  
        axios.put('/games', updateObject)
        .then(() => {console.log('Updated game!')})
        .catch(() => {
          console.log('Something went wrong!')
          setHand(oldHand)
          setBoard(oldBoard)
          setTurn(turn => !turn)
        })
      }
    }
  }

  return (
    <>
      <div className='game-container'>
        {scoreboard ? '' : <Turn player={player} turn={turn} opponent={opponent} />}
        <Board board={board} player={player} handlePlayCard={handlePlayCard} />
        {scoreboard ? <Scoreboard scoreboard={scoreboard} /> : <Hand hand={hand} selected={selected} handleSelect={handleSelect} />}
      </div>
    </>
  )

}

function Turn({player, turn, opponent}) {
  if (player === turn) {
    return <div className='turn'>Your Turn</div>
  } else {
    return <div className='turn'>{opponent}'s Turn</div>
  }
}