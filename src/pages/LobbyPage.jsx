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

  const acceptProposal = async (index, name) => {
    // update state
    const oldProposals = [...proposals]
    const newProposals = [...proposals]
    newProposals.splice(index, 1)
    setProposals(newProposals)

    // post to db
    axios.delete('/proposals', {
      data: {
        token: tokenService.getToken(),
        name
      }
    })
    .then(response => response.data)
    .catch(error => {
      console.log(error)
      setProposals(oldProposals)
    })
  } 
  
  return (
    <div>
      <table>
        {proposals.map((proposal, index) => 
          <Proposal 
            proposal={proposal} 
            acceptProposal={acceptProposal}
            index={index}
            user={user}
          />
        )}
      </table>
      
      <button onClick={createProposal}>Create Game</button>
    </div>
  )
}

function Proposal({proposal, acceptProposal, index, user}) {
  const handleClick = (event) => {
    const {index, name} = event.target.dataset
    acceptProposal(index, name)
  }
  
  if (user.username !== proposal.name) {
    return (
      <tr>
        <td>{proposal.name}</td>
        <td>
          <button 
            data-name={proposal.name}
            data-index={index} 
            onClick={handleClick}
          >
            Join Game
          </button>
        </td>
      </tr>
    )
  } else {
    return (
      <tr>
        <td>{proposal.name}</td>
        <td></td>
      </tr>
    )
  }
}