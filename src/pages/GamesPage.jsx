import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import tokenService from '../utils/tokenService'

export default function Games({user}) {
  const [games, setGames] = useState('')

  const refresh = useCallback(() => {
    axios.get('/api/games', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokenService.getToken()
      }
    }).then(response => setGames(response.data))
  },[])

  // refresh when component renders for the first time  
  useEffect(() => {
    refresh()
  },[refresh])

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    let appContainerEl = document.querySelector('.app-container')
    appContainerEl.style.setProperty('--vh', `${vh}px`)

    window.addEventListener('resize', () => {
      let resizedVh = window.innerHeight * 0.01
      appContainerEl.style.setProperty('--vh', `${resizedVh}px`)
    })
  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 3000)
    return () => clearInterval(interval)
  })

  return (
    <div>
      {games ? <GamesList games={games} user={user} /> : ''}
    </div>
  )
}

function GamesList({games, user}) {
  return (
    <table>
      <tr>
        <th>Opponent</th>
        <th>Status</th>
        <th></th>
      </tr>
      {games.map(game => <GamesListItem game={game} user={user} />)}
    </table>
  )
}

function GamesListItem({game, user}) {
  return (
    <tr>
      <td><Opponent game={game} user={user} /></td>
      <td><Status game={game} user={user} /></td>
      <td><GameLink game={game} /></td>
    </tr>
  )
}

function Opponent({game, user}) {
  const {playerOneName, playerTwoName} = game
  const opponent = playerOneName === user.username ? playerTwoName : playerOneName
  
  return (
    <>
      {opponent}
    </>
  )
}

function Status({game, user}) {
  const {playerOneName, playerTwoName, board, turn} = game
  const player = playerOneName === user.username ? true : false
  const opponent = playerOneName === user.username ? playerTwoName : playerOneName

  if (!board.includes('')) {
    return 'Complete'
  } else {
    if (player === turn) {
      return 'Your Turn'
    } else {
      return `${opponent}'s Turn`
    }
  }
}

function GameLink({game:{_id}}) {
  return (
    <Link
      to={`/games/${_id}`}
      key={_id}
    >Link
    </Link>
  )
}