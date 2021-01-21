import React from 'react'

export default function Scoreboard({scoreboard, player, user, opponent}) {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Hand</th>
            <th>{player ? user.username : opponent }</th>
            <th>{player ? opponent : user.username}</th>
          </tr>
          {[0,1,2,3,4].map(handNumber => {
            return (
              <ScoreboardLine
                handNumber={handNumber}
                playerOneHand={scoreboard.playerOne[handNumber]}
                playerTwoHand={scoreboard.playerTwo[handNumber]}
              />
            )
          })}
        </tbody>
      </table>
    </>
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
    <tr>
      <ScoreboardHandTitle color={handColors[handNumber]} />
      <ScoreboardHand hand={playerOneHand} isWin={isPlayerOneWinner} />
      <ScoreboardHand hand={playerTwoHand} isWin={!isPlayerOneWinner} />
    </tr>
  )
}

function ScoreboardHandTitle({color}) {
  return (
    <td
      style={{color:{color}}}
    >
      {color}
    </td>
  )
}

function ScoreboardHand({hand, isWin}) {
  const handMap = {
    1: 'High Card',
    2: 'Pair',
    3: '2 Pair',
    4: '3 Of A Kind',
    5: 'Stright',
    6: 'Flush',
    7: 'Full House',
    8: '4 Of A King',
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