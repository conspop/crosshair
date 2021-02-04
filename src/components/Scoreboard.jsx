import React from 'react'

export default function Scoreboard({scoreboard, player, user, opponent}) {
  return (
    <div className='scoreboard'>
      <div className='scoreboard-line'>
        <div className='scoreboard-title'>{player ? user.username : opponent}</div>
        <div className='scoreboard-title'>{player ? opponent : user.username}</div>
      </div>
      
      {[0,1,2,3,4].map(handNumber => {
        return (
          <ScoreboardLine
            handNumber={handNumber}
            playerOneHand={scoreboard.playerOne[handNumber]}
            playerTwoHand={scoreboard.playerTwo[handNumber]}
          />
        )
      })}
    </div>
  )
}

function ScoreboardLine({handNumber, playerOneHand, playerTwoHand}) {
  const handColors = {
    0: 'purple',
    1: 'orange',
    2: 'pink',
    3: 'blue',
    4: 'green'
  }

  let isPlayerOneWinner = false
  for (let index = 0; index <= 6; index++ ) {
    console.log(playerOneHand[index])
    console.log(playerTwoHand[index])
    if (playerOneHand[index] > playerTwoHand[index]) {
      isPlayerOneWinner = true
      break
    } else if (playerOneHand[index] < playerTwoHand[index]) {
      break
    }
  }

  return (
    <div className='scoreboard-line' style={{backgroundColor: handColors[handNumber]}}>
      <ScoreboardHand hand={playerOneHand} isWin={isPlayerOneWinner} />
      <ScoreboardHand hand={playerTwoHand} isWin={!isPlayerOneWinner} />
    </div>
  )
}

function ScoreboardHand({hand, isWin}) {
  const handMap = {
    1: 'High Card',
    2: 'Pair',
    3: '2 Pair',
    4: '3 Of A Kind',
    5: 'Straight',
    6: 'Flush',
    7: 'Full House',
    8: '4 Of A Kind',
    9: 'Straight Flush',
    10: 'Royal Flush'
  } 

  const handStyle = {
    fontWeight: (isWin ? 'bold' : 'normal')
  }
  
  return (
    <td
      style={handStyle}
    >
      {handMap[hand[0]]}
    </td>
  )
}