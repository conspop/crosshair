import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import tokenService from '../utils/tokenService'

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
      <>
      <div>
        {leaderboard.length > 0 
        ?
        <table className='leaderboard-table'>
          <tbody>
            <tr>
              <th>Player</th>
              <th>ELO</th>
            </tr>
            {leaderboard.map(player => 
              <Player 
                name={player.name}
                ELO={player.ELO}
                ELOChange={player.ELOChange}
              />
            )}
          </tbody>
        </table>
        :
        ''
        }
      </div>
    </>
    </>
  )
}

function Player({name, ELO, ELOChange}) {
  return (
    <tr>
      <td>{name}</td>
      <td>{ELO} ({ELOChange})</td>
    </tr>
  )
}