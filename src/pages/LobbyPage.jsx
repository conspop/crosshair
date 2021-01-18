import React, { useState, useEffect } from 'react'
import axios from 'axios'
import tokenService from '../utils/tokenService'

export default function LobbyPage({user}) {
  const [proposals, setProposals] = useState([{name:''}])

  useEffect(() => {
    const getProposals = async () => {
      await axios.get('/proposals', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tokenService.getToken()
        }
      }).then(response => setProposals(response.data))
    }
    getProposals()
  },[])

  const createProposal = async () => {
    // update state
    const oldProposals = [...proposals]
    const newProposals = [...proposals, {playerId: user._id, name: user.username}]
    setProposals(newProposals)

    // post to db
    axios.post('/proposals', {
      token: tokenService.getToken()
    })
    .then(response => response.data)
    .catch(error => {
      console.log(error)
      setProposals(oldProposals)
    })
  } 

  const joinGame = async () => {
    console.log('Join!')
  }
  
  return (
    <div>
      <table>
        {proposals.map(proposal => <Proposal proposal={proposal} joinGame={joinGame} />)}
      </table>
      
      <button onClick={createProposal}>Create Game</button>
    </div>
  )
}

function Proposal({proposal, joinGame}) {
  return (
    <tr>
      <td>{proposal.name}</td>
      <td><button onClick={joinGame}>Join Game</button></td>
    </tr>
  )
}