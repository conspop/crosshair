import React from 'react'

export default function HowToPlayPage() {
  return (
    <div>
      <h2>How to Play Crosshair</h2>
        <ol>
          <li>Crosshair is simple to learn and hard to master.</li>
          <li>You and your opponent are each dealt 12 cards.</li>
          <li>The board is a 5x5 grid and a random card is place in the middle spot at the beginning of the game.</li>
          <li>You will take turns adding a card to an open spot on the grid.</li>
          <li>Your hands are the columns. Your opponents hands are the rows.</li>
          <li>Your first row (left-most column) corresponds to your opponents first row (bottom row) and so on.</li>
          <li>Once all 25 spots are filled, the player who wins 3 or more hands is the winner of the game.</li>
        </ol>
      <h2>How to Use this App</h2>
        <ol>
          <li>To get into a game, navigate to the lobby.</li>
          <li>If another player has created a game, you'll see it there and can choose Join Game.</li>
          <li>If there are no games listed, create one and another player will join it.</li>
          <li>Navigate to Your Games to see a list of the games you're currently playing.</li>
        </ol>
    </div>
  )
}