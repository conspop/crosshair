import React from 'react'
import Card from './Card'

export default function Board({board, player, handlePlayCard}) {
  const playerTwoBoardMap = {
    0: 24, 1: 19, 2: 14, 3: 9, 4: 4,
    5: 23, 6: 18, 7: 13, 8: 8, 9: 3,
    10: 22, 11: 17, 12: 12, 13: 7, 14: 2,
    15: 21, 16: 16, 17: 11, 18: 6, 19: 1,
    20: 20, 21: 15, 22: 10, 23: 5, 24: 0
  }

  // flips board diagonally for playerTwo so perspective is the same for both players
  let orientedBoard = []
  if (player) {
    orientedBoard = board.map((card, index) => {
      return <Card 
        card={card} 
        index={index}
        handleClick={handlePlayCard}
      />
    })
  } else {
    for (let i = 0; i < board.length; i++) {
      orientedBoard.push(
        <Card 
          card={board[playerTwoBoardMap[i]]} 
          index={playerTwoBoardMap[i]}
          handleClick={handlePlayCard}
        />
      )
    }
  }
    
  return (
    <div className='board'>
      {orientedBoard}
    </div> 
  )
}