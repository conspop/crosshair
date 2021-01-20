import React from 'react'

export default function Scoreboard({scoreboard, player, user, opponent}) {
  const handMap = {
    1: 'High Card',
    2: 'Pair',
    3: '2 Pair',
    4: '3 Of A King',
    5: 'Stright',
    6: 'Flush',
    7: 'Full House',
    8: '4 Of A King',
    9: 'Straight Flush',
    10: 'Royal Flush'
  } 
  
  return (
    <>
      <table>
        <tr>
          <th>Hand</th>
          <th>{player ? user.username : opponent }</th>
          <th>{player ? opponent : user.username}</th>
          <th>Winner</th>
        </tr>
        <tr>
          <td>1</td>
          <td>{handMap[scoreboard.playerOne[0][0]]}</td>
          <td>{handMap[scoreboard.playerTwo[0][0]]}</td>
        </tr>
        <tr>
          <td>2</td>
          <td>{handMap[scoreboard.playerOne[1][0]]}</td>
          <td>{handMap[scoreboard.playerTwo[1][0]]}</td>
        </tr>
        <tr>
          <td>3</td>
          <td>{handMap[scoreboard.playerOne[2][0]]}</td>
          <td>{handMap[scoreboard.playerTwo[2][0]]}</td>
        </tr>
        <tr>
          <td>4</td>
          <td>{handMap[scoreboard.playerOne[3][0]]}</td>
          <td>{handMap[scoreboard.playerTwo[3][0]]}</td>
        </tr>
        <tr>
          <td>5</td>
          <td>{handMap[scoreboard.playerOne[4][0]]}</td>
          <td>{handMap[scoreboard.playerTwo[4][0]]}</td>
        </tr>
      </table>
    </>
  )
}