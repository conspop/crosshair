import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './GamePage.css'
import Board from '../components/Board'
import Hand from '../components/Hand'
import Scoreboard from '../components/Scoreboard'

export default function GamePage({user, logout}) {
  const {gameId} = useParams()
  const [id, setId] = useState('')
  const [board, setBoard] = useState(Array(25).fill(''))
  const [player, setPlayer] = useState('')
  const [hand, setHand] = useState(Array(12).fill(''))
  const [opponent, setOpponent] = useState('')
  const [turn, setTurn] = useState('')
  const [scoreboard, setScoreboard] = useState('')
  const [selected, setSelected] = useState('')
  const [lastPlayed, setLastPlayed] = useState('')
  const [resign, setResign] = useState('')

  const refresh = useCallback(() => {
    axios.get(`/api/games/${gameId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokenService.getToken()
      }
    })
    .then(response => {
      const dataPlayer = response.data.game.playerOneName === user.username ? true : false
      setId(response.data.game._id)
      setBoard(response.data.game.board)
      setPlayer(dataPlayer)
      setHand(dataPlayer ? response.data.game.playerOneHand : response.data.game.playerTwoHand)
      setOpponent(dataPlayer ? response.data.game.playerTwoName : response.data.game.playerOneName)
      setTurn(response.data.game.turn)
      setScoreboard(response.data.game.scoreboard)
      setLastPlayed(response.data.game.lastPlayed)
      setResign(response.data.game.resign)
      if (response.data.version !== user.version) {
        axios.post('/api/games/updateVersion', {token: tokenService.getToken()})
        .then(() => {
          window.location.reload()
          logout()
        })
        .catch(error => {console.log(error.message)})
      }
    })
    .catch(() => console.log('Something went wrong!'))
  },[gameId, user.username])

  // get game data when component first loads
  useEffect(() => {
    refresh()
  },[refresh])

  useEffect(() => {
    const interval = setInterval(() => {
      if (player !== turn) {
        refresh()
      }
    }, 1000)
    return () => clearInterval(interval)
  })

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    let appContainerEl = document.querySelector('.app-container')
    appContainerEl.style.setProperty('--vh', `${vh}px`)

    window.addEventListener('resize', () => {
      let resizedVh = window.innerHeight * 0.01
      appContainerEl.style.setProperty('--vh', `${resizedVh}px`)
    })
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
        setLastPlayed(index)
  
        const updateObject = {
          token: tokenService.getToken(),
          id,
          [player ? 'playerOneHand' : 'playerTwoHand']: newHand,
          board: newBoard,
          lastPlayed: index
        }
  
        axios.put('/api/games', updateObject)
        .then(() => {console.log('Updated game!')})
        .catch(() => {
          console.log('Something went wrong!')
          setHand(oldHand)
          setBoard(oldBoard)
          setTurn(turn => !turn)
          setLastPlayed('')
        })
      }
    }
  }

  const handleResignGame = () => {

    setResign(user.username)

    const updateObject = {
      token: tokenService.getToken(),
      id,
      resign: user.username,
      opponent: opponent
    }

    axios.put('/api/games/resign', updateObject)
    .then(() => {console.log('Resigned!')})
    .catch(() => {
      console.log('Something went wrong!')
      setResign('')
    })
  }

  const cardsPlayed = board.filter(card => card !== '').length

  return (
    <>
      <div className='game-container'>
        <div style={{width: '100%', height: '5vh', display: 'flex', justifyContent: 'space-evenly'}}>
          <ResignButton handleResignGame={handleResignGame} cardsPlayed={cardsPlayed} />
        </div>
        <Turn user={user} player={player} turn={turn} opponent={opponent} />
        <Board board={board} player={player} handlePlayCard={handlePlayCard} lastPlayed={lastPlayed} />
        {scoreboard ? <Scoreboard scoreboard={scoreboard} player={player} user={user} opponent={opponent} /> : ''}
        {resign ? <h2>{resign} resigned</h2> : ''}
        {!scoreboard && !resign ? <Hand hand={hand} selected={selected} handleSelect={handleSelect} /> : ''}
      </div>
    </>
  )

}

function Turn({user, player, turn, opponent}) {
  return (
    <div style={{display:'flex', width:'100%', fontSize:'1.25rem', height: '5vh', alignItems:'center'}}>
      <div style={{width:'40%', textAlign:'center'}}>{user.username}</div>
      <div style={{width:'20%', textAlign:'center'}}>
        {player === turn ? <i className="fas fa-chevron-left"></i> : <i className="fas fa-chevron-right"></i>}
      </div>
      <div style={{width:'40%', textAlign:'center'}}>{opponent}</div>
    </div>
  )
  
}

function ResignButton({handleResignGame, cardsPlayed}) {
  const [showResign, setShowResign] = useState(true)
  const [areYouSure, setAreYouSure] = useState(false)

  const handleResign = () => {
    setAreYouSure(true)
    setTimeout(() => {setAreYouSure(false)}, 1000)
  }

  const handleConfirmResign = () => {
    handleResignGame()
    setShowResign(false)
  }

  if (showResign) {
    if (areYouSure) {
      return <button className='resign-button' onClick={handleConfirmResign}>Are you sure?</button>
    } else {
      return <button disabled={cardsPlayed < 12 ? true : false} className='resign-button' onClick={handleResign}>Resign</button>
    }
  } else {
    return ''
  }
  
}