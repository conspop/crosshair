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

  const columnLines = {
    0: 'green', 1: 'green', 2: 'green', 3: 'green',
    5: 'blue', 6: 'blue', 7: 'blue', 8: 'blue',
    10: 'pink', 11: 'pink', 12: 'pink', 13: 'pink',
    15: 'orange', 16: 'orange', 17: 'orange', 18: 'orange',
    20: 'purple', 21: 'purple', 22: 'purple', 23: 'purple',
  }

  const rowLines = {
    4: ['purple', 'orange', 'pink', 'blue', 'green'],
    9: ['purple', 'orange', 'pink', 'blue', 'green'],
    14: ['purple', 'orange', 'pink', 'blue', 'green'],
    19: ['purple', 'orange', 'pink', 'blue', 'green']
  }

  // flips board diagonally for playerTwo so perspective is the same for both players
  let orientedBoard = []
  if (player) {
    orientedBoard = board.map((card, index) => {
      return (
        <>
          <Card 
            card={card} 
            index={index}
            handleClick={handlePlayCard}
          />
          {columnLines[index] ? <ColumnLine color={columnLines[index]} /> : false}
          {rowLines[index] ? 
            <>
              <RowLine color={rowLines[index][0]} />
              <div></div> 
              <RowLine color={rowLines[index][1]} />
              <div></div> 
              <RowLine color={rowLines[index][2]} />
              <div></div> 
              <RowLine color={rowLines[index][3]} />
              <div></div> 
              <RowLine color={rowLines[index][4]} />
            </>
            : false}
        </>
      )
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
      if (columnLines[i]) {
        orientedBoard.push(<ColumnLine color={columnLines[i]} />)
      }
      if (rowLines[i]) {
        orientedBoard.push(
          <div className='row-line'></div>,
          <div></div>,
          <div className='row-line'></div>,
          <div></div>, 
          <div className='row-line'></div>,
          <div></div>, 
          <div className='row-line'></div>,
          <div></div>, 
          <div className='row-line'></div>
        )
      }
      
    }
  }
    
  return (
    <div className='board'>
      {orientedBoard}
    </div> 
  )
}

function ColumnLine({color}) {
  return (
    <div className='column-line' style={{backgroundColor: color}}></div>
  )
}

function RowLine({color}) {
  return (
    <div className='row-line' style={{backgroundColor: color}}></div>
  )
}