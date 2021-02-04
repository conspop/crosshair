import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './GamesPage.css'
import moment from 'moment'

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
    <div className='games-list-container'>
      <h1>Games</h1>
      <p>This is a list of your games. You have one week to move before you forfeit.</p>
      {games ? <GamesList games={games} user={user} /> : ''}
    </div>
  )
}

function GamesList({games, user}) {
  return (
    <>
      {/* Your Turn */}
      <div style={{marginBottom: '1.5rem'}}>
        {games.filter(game => (game.scoreboard === null) && (!game.resign) && (user.username === game.playerOneName) === game.turn)
        .map(game => <GamesListItem game={game} user={user} group='Your Turn' />)}
      </div>
      {/* Their Turn */}
      <div style={{marginBottom:'1.5rem'}}>
        {games.filter(game => (game.scoreboard === null) && (!game.resign) && (user.username === game.playerOneName) !== game.turn)
        .map(game => <GamesListItem game={game} user={user} group='Their Turn' />)}
      </div>
      {/* Completed */}
      {games.filter(game => (game.scoreboard !== null) || (game.resign)).reverse()
      .map(game => <Completed game={game} user={user} group='Completed' />)}
    </>
  )
}

function GamesListItem({game, user, group}) {
  return (
    <div className='games-list-item'>
      <OpponentAndTime game={game} user={user} />
      <GameLink game={game} user={user} group={group} />
    </div>
  )
}

function OpponentAndTime({game, user, group}) {
  const {playerOneName, playerTwoName} = game
  const opponent = playerOneName === user.username ? playerTwoName : playerOneName
  
  return (
    <div style={{alignSelf: 'center'}}><strong>{opponent}</strong> <Time game={game} /></div>
  )
}

function Time({game}) {
  const currentTime = moment(new Date())
  const lastPlayTime = moment(game.lastPlayTime)
  let daysSinceLastPlay = currentTime.diff(lastPlayTime, 'days')
  let daysSinceLastPlayFormatted
  if (!game.lastPlayTime) {
    daysSinceLastPlayFormatted = '(start clock ->)'
  } else if (daysSinceLastPlay < 1) {
    daysSinceLastPlayFormatted = ''
  } else {
    daysSinceLastPlayFormatted = `(${daysSinceLastPlay} days)`
  }
  return daysSinceLastPlayFormatted
}

function Completed({game, user, group}) {
  return (
    <div className='games-list-item'>
      {/* <OpponentAndTime game={game} user={user} /> */}
      <WinOrLoss game={game} user={user} />
      <GameLink game={game} user={user} group={group} />
    </div>
  )
}

function WinOrLoss({game, user}) {
  const isPlayerOne = game.playerOneName === user.username
  const opponent = game.playerOneName === user.username ? game.playerTwoName : game.playerOneName
  let isPlayerOneWinner = false
  if (game.resign) {
    if (game.resign !== game.playerOneName) {
      isPlayerOneWinner = true
    }
  } else {
    const {playerOne, playerTwo} = game.scoreboard
    let playerOneWins = 0
    for (let hand = 0; hand < 5; hand++) {
      for (let index = 0; index <= 6; index++ ) {
        if (playerOne[hand][index] > playerTwo[hand][index]) {
          playerOneWins ++
          break
        } else if (playerOne[index] < playerTwo[index]) {
          break
        }
      }
    }
    console.log(playerOneWins)
    if (playerOneWins >= 3) {isPlayerOneWinner = true}
  }
  if (isPlayerOne === isPlayerOneWinner) {
    return (
      <div style={{alignSelf: 'center'}}><strong>W vs. {opponent}</strong> <ResultType game={game} /></div>
    )
  } else {
    return (
      <div style={{alignSelf: 'center'}}><strong>L vs. {opponent}</strong> <ResultType game={game} /></div>
    )
  }
}

function ResultType({game}) {
  if (game.resign) {
    return '(Resigned)'
  } else if (game.forfeit) {
    return '(Forfeit)'
  } else {
    return ''
  }
}

function Status({game, user}) {
  const {playerOneName, playerTwoName, board, turn} = game
  const player = playerOneName === user.username ? true : false
  const opponent = playerOneName === user.username ? playerTwoName : playerOneName

  if (!board.includes('')) {
    return 'View'
  } else {
    if (player === turn) {
      return 'Your Turn'
    } else {
      return `Their Turn`
    }
  }
}

function GameLink({game, user, group}) {
  let buttonStyle
  if (group === 'Your Turn') {
    buttonStyle = {
      backgroundColor: 'green'
    }
  } else if (group === 'Their Turn') {
    buttonStyle = {
      backgroundColor: 'red'
    }
  } else if (group === 'Completed') {
    buttonStyle = {
      backgroundColor: 'blue'
    }
  }

  let buttonText
  if (group === 'Your Turn') {
    buttonText = 'Your Turn'
  } else if (group === 'Their Turn') {
    buttonText = 'Their Turn'
  } else if (group === 'Completed') {
    buttonText = 'View'
  }

  return (
    <Link
      to={`/games/${game._id}`}
      key={game._id}
      className='game-link-button' 
      style={buttonStyle}
    >{buttonText}
    </Link>    
  )
}