import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import tokenService from '../utils/tokenService'
import './LobbyPage.css'
import { Redirect } from 'react-router-dom'

export default function LobbyPage({user}) {
  const [proposals, setProposals] = useState('')
  const [redirect, setRedirect] = useState(false)

  const refresh = useCallback(() => {
    axios.get('/api/proposals', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokenService.getToken()
      }
    }).then(response => setProposals(response.data))
  },[])

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    let appContainerEl = document.querySelector('.app-container')
    appContainerEl.style.setProperty('--vh', `${vh}px`)

    window.addEventListener('resize', () => {
      let resizedVh = window.innerHeight * 0.01
      appContainerEl.style.setProperty('--vh', `${resizedVh}px`)
    })
  },[])

  // refresh when component renders for the first time
  useEffect(() => {
    refresh()
  },[refresh])

  useEffect(() => {
    const interval = setInterval(() => {
      refresh()
    }, 3000)
    return () => clearInterval(interval)
  })

  const createProposal = async () => {
    // update state
    const oldProposals = [...proposals]
    const newProposals = [...proposals, {playerId: user._id, name: user.username}]
    setProposals(newProposals)

    // post to db
    axios.post('/api/proposals', {
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

    // create game
    axios.post('/api/games', {
      token: tokenService.getToken(),
      playerOneName: name
    })
    .then(() => {console.log('Game created!')})
    .catch(() => {console.log('Could not create game!')})

    // delete proposal
    axios.delete('/proposals', {
      data: {
        token: tokenService.getToken(),
        name
      }
    })
    .then(() => {console.log('Proposal deleted!')})
    .catch(() => {console.log('Could not delete proposal!')})


    axios.delete('/api/proposals', {
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

  const goToGames = () => {
    setRedirect(true)
  }
  
  return (
    <>
      {redirect ? <Redirect to='/games' /> : ''}
      <div className='lobby-container'>
        <h1>Lobby</h1>
        <p>If you're looking for a game, join one below. If there aren't any, create one and check back in a little bit. You'll be playing in no time.</p>
        {proposals.length > 0 
        ?
        <>
          {proposals.map((proposal, index) => 
            <Proposal 
              proposal={proposal} 
              acceptProposal={acceptProposal}
              index={index}
              user={user}
              goToGames={goToGames}
            />
          )}
        </>
        :
        ''
        }
        <div className='lobby-button'>
          <button className='create-game-button' onClick={createProposal}>Create Game</button>
        </div>
      </div>
    </>
  )
}

function Proposal({proposal, acceptProposal, index, user, goToGames}) {
  const handleClick = (event) => {
    const {index, name} = event.target.dataset
    acceptProposal(index, name)
    goToGames()
  }
  
  return (
    <div className='created-game-list'>
      <div><strong>{proposal.name}</strong> ({proposal.endingELO})</div>
      {proposal.name === user.username ?
        <div></div> :
        <div>
          <button 
            data-name={proposal.name}
            data-index={index} 
            onClick={handleClick}
          >
            Join
          </button>
        </div>
      }
    </div>
  )
}