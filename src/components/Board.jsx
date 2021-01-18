import React from 'react'
import Card from './Card'

export default function Board({board, player}) {
  // flip board diagonally if playerTwo
  let orientedBoard
  if (player) {
    orientedBoard = [...board]
  } else {
    orientedBoard = [
      board[24], board[19], board[14], board[9], board[4],
      board[23], board[18], board[13], board[8], board[3],
      board[22], board[17], board[12], board[7], board[2],
      board[21], board[16], board[11], board[6], board[1],
      board[20], board[15], board[10], board[5], board[0]
    ]
  }

  return (
    <div className='board'>
      {orientedBoard.map((card, index) => {
        return <Card 
          className='card'
          card={card} 
          index={index}
        />
      })}
    </div>
    
  )
}