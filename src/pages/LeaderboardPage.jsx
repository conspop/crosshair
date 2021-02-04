import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './LeaderboardPage.css'
import moment from 'moment'

export default function LeaderboardPage({user}) {
  const [leaderboard, setLeaderboard] = useState('')

  const refresh = useCallback(() => {
    axios.get('/api/leaderboard', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokenService.getToken()
      }
    }).then(response => setLeaderboard(response.data))
  },[])

  useEffect(() => {
    refresh()
  },[refresh])

  return (
    <>
      <div className='leaderboard-container'>
        <h1>Ranks</h1>
        <p>These ratings are based on the Elo system. To be included, you must have 5 games under your belt.</p>
        {leaderboard.length > 0 
        ?
        leaderboard.map(player => 
          <Player 
            name={player.name}
            ELO={player.ELO}
            ELOChange={player.ELOChange}
            isWin={player.isWin}
            opponent={player.opponent}
            date={player.date}
            numberResults={player.numberResults}
          />
        )
        :
        ''
        }
      </div>
    </>
  )
}

function Player({name, ELO, ELOChange, isWin, opponent, date, numberResults}) {
  const currentTime = moment(new Date())
  const lastResultDate = moment(date)

  const color = {
    color: isWin ? 'white' : 'red',
    justifySelf: 'end',
    fontWeight: 'bold'
  }

  console.log(new Date())

  if (lastResultDate.add(7, 'days').isBefore(currentTime) || numberResults < 5) {
    return ''
  } else {
    return (
      <div className='leaderboard-line'>
        <div>
          <strong>{name}</strong>
        </div>
        <div style={{justifySelf: 'end'}}>
          <strong>{ELO}</strong>
        </div>
        <div>
          {isWin ? 'W' : 'L'} vs. {opponent}
        </div>
        <div style={color}>
          {ELOChange}
        </div>
      </div>
    )
  }
}