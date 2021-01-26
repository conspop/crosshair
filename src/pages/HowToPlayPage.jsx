import React, { useEffect } from 'react'
import './HowToPlayPage.css'

export default function HowToPlayPage() {

  useEffect(() => {
    let vh = window.innerHeight * 0.01
    let appContainerEl = document.querySelector('.app-container')
    appContainerEl.style.setProperty('--vh', `${vh}px`)

    window.addEventListener('resize', () => {
      let resizedVh = window.innerHeight * 0.01
      appContainerEl.style.setProperty('--vh', `${resizedVh}px`)
    })
  },[])

  return (
    <div className='how-to-play-container'>
      <h2>How to Play Crosshair</h2>
        <ol>
          <li>The game is played with a deck of cards that has 2 through 7 removed.</li>
          <li>You and your opponent are each dealt 12 cards.</li>
          <li>The board is a 5x5 grid and the game begins with a card placed in the middle of the grid.</li>
          <li>You and your opponent will take turns adding a card to an open spot on the grid.</li>
          <li>You are building 5 poker hands. If you need a reminder, <a href='https://en.wikipedia.org/wiki/List_of_poker_hands' target='_blank'>here are the hands.</a></li>
          <li>Your hands are the vertical columns. Your opponents hands are the horizontal rows.This means that you share one card in each hand. This is signified by colour in the game.</li>
          <li>Once all 25 spots are filled, the player who wins 3 or more of the hands is the winner of the game.</li>
        </ol>
      <h2>How to Use this App</h2>
        <ol>
          <li>To get started, create an account by choosing Sign Up.</li>
          <li>If you want to create a new game, choose Create Game in the Lobby.</li>
          <li>You can join a game that someone else has created (if there is one) by choosing Join Game.</li>
          <li>You can view the list of games you're currently playing and enter those games by choosing Your Games.</li>
          <li>You'll join the leaderboard when you've completed your first game!</li>
        </ol>
    </div>
  )
}