import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './GamesPage.css'

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
      <h1>Games</h1>
      {games ? <GamesList games={games} user={user} /> : ''}
    </div>
  )
}

function GamesList({games, user}) {
  return (
    <div className='games-list-container'>
      <h3>Your Turn</h3>
      <table>
        {games.filter(game => (game.scoreboard === null) && (!game.resign) && (user.username === game.playerOneName) === game.turn)
        .map(game => <GamesListItem game={game} user={user} />)}
      </table>
      <h3>Their Turn</h3>
      <table>
        {games.filter(game => (game.scoreboard === null) && (!game.resign) && (user.username === game.playerOneName) !== game.turn)
        .map(game => <GamesListItem game={game} user={user} />)}
      </table>
      <h3>Completed</h3>
      <table>
        {games.filter(game => (game.scoreboard !== null) || (game.resign)).reverse()
        .map(game => <GamesListItem game={game} user={user} />)}
      </table>
    </div>
  )
}

function GamesListItem({game, user}) {
  return (
    <tr>
      <td><Opponent game={game} user={user} /></td>
      <td><GameLink game={game} user={user} /></td>
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
      return `Their Turn`
    }
  }
}

function GameLink({game, user}) {
  return (
    <Link
      to={`/games/${game._id}`}
      key={game._id}
    ><Status game={game} user={user} />
    </Link>
  )
}