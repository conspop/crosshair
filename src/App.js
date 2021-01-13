import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

const suitsImages = {
  'S':<i className="fas fa-spade"></i>,
  'C':<i className="fas fa-club"></i>,
  'H':<i className="fas fa-heart"></i>,
  'D':<i className="fas fa-diamond"></i>
}

const numberMap = {
  2:'2',
  3:'3',
  4:'4',
  5:'5',
  6:'6',
  7:'7',
  8:'8',
  9:'9',
  10:'10',
  11:'J',
  12:'Q',
  13:'K',
  14:'A'
}

export default function App() {
  
  const [name, setName] = useState('')
  const [player, setPlayer] = useState('')
  const [gameId, setGameId] = useState('')
  const [playerOneName, setPlayerOneName] = useState('')
  const [playerTwoName, setPlayerTwoName] = useState('')
  const [turn, setTurn] = useState('')
  const [hand, setHand] = useState('')
  const [board, setBoard] = useState('')
  const [selected, setSelected] = useState('')

  const putNameInState = (name) => {
    setName(name)
  }

  const joinGame = (data, name) => {
    const setOthers = () => {
      setPlayerOneName(data.playerOneName)
      setPlayerTwoName(data.playerTwoName)
      console.log(name)
      console.log(data.playerOneName)
      if (name === data.playerOneName) {
        setPlayer('playerOne')
        setHand(data.playerOneHand)
      } else {
        setPlayer('playerTwo')
        setHand(data.playerTwoHand)
      }
      setBoard(data.board)
      setTurn(true)
    }
    setName(name)
    setOthers()
    setGameId(data.gameId)
  }

  const selectCard = (index) => {
    if (parseInt(index) === selected) {
      setSelected('')
    } else {
      setSelected(parseInt(index))
    }
  }

  const playCard = (index) => {
    if (selected || selected === 0) {
      const oldHand = [...hand]
      const handCopy = [...hand]
      const playedCard = handCopy.splice(selected,1)

      const oldBoard = [...board]
      const boardCopy = [...board]
      boardCopy[index] = playedCard[0]

      setHand(handCopy)
      setBoard(boardCopy)
      setSelected('')

      console.log(turn)

      axios.put(`/games/play-card`,{
        gameId,
        [name === playerOneName ? 'playerOneHand' : 'playerTwoHand']:handCopy,
        board:boardCopy,
        turn: !turn
      })
      .catch(err => {
        console.log(err.message)
        setHand(oldHand)
        setBoard(oldBoard)
      })
    }
  }
  
  return (
    gameId === ''
    ?
    <CreateOrJoinGame 
      putNameInState={putNameInState}
      joinGame={joinGame}
    />
    :
    <Game 
      gameId={gameId}
      name={name}
      player={player}
      hand={hand}
      board={board}
      selected={selected}
      selectCard={selectCard}
      playCard={playCard}
    />
  )
} 

function CreateOrJoinGame({joinGame, putNameInState}) {
  const [username, setUsername] = useState('')
  const [gameId, setGameId] = useState('')

  const createGame = () => {
    axios.post('/games', {
      username
    })
    .then(res => {
      joinGame(res.data, username)
    })
    .catch(err => console.log(err.message))
  }

  const handleJoinGame = () => {
    axios.put('/games/join-game', {
      username,
      gameId
    })
    .then(res => {
      joinGame(res.data, username)
    })
    .catch(err => console.log(err.message))
  }

  return (
    <div className='create-or-join-container'>
      <div>
        <label>Name: </label>
        <input type="text" onChange={event => setUsername(event.target.value)} />
      </div>
      <button onClick={createGame}>Create New Game</button>
      <div>
        <label>Game Id: </label>
        <input type="text" onChange={event => setGameId(event.target.value)}/>
        <button onClick={handleJoinGame}>Join Existing Game</button>
      </div>
    </div>
  )
}

function Game({ gameId, name, player, hand, board, selected, selectCard, playCard}) {
  let orientedBoard
  if (player === 'playerTwo') {
    orientedBoard = [
      board[24], board[19], board[14], board[9], board[4],
      board[23], board[18], board[13], board[8], board[3],
      board[22], board[17], board[12], board[7], board[2],
      board[21], board[16], board[11], board[6], board[1],
      board[20], board[15], board[10], board[5], board[0]
    ]
  } else {
    orientedBoard = [...board]
  }

  console.log(orientedBoard)

  return (
    <div className='game-container'>
      <div className='game-id'>{gameId} | {name}</div>
      <div className='title'>Crosshair</div>
      <div className='message'>Seb's Turn</div>
      <div className='board'>
        {orientedBoard.map((card, index) => {
          return <Card 
            card={card} 
            index={index} 
            location='board' 
            playCard={playCard}
          />
        })}
      </div>
      <div className='hand'>
        {hand.map((card, index) => {
          return <Card 
            selected={(index === selected ? true : false)}
            selectCard={selectCard}
            card={card} 
            index={index} 
            location='hand' 
          />
        })}
      </div>
    </div>
  )
}

function Card(props) {
  const {suit, number} = props.card
  const {index, location, selected, selectCard, playCard} = props

  const cardStyle = {
    color: (suit === 'S' || suit === 'C') ? 'black' : 'red',
    border: selected ? '4px solid green' : '1px solid black'
  }

  const handleClick = (event) => {
    const {location, index} = event.currentTarget.dataset
    if (location === 'hand') {
      selectCard(index)
    } else if (location === 'board') {
      playCard(index)
    }
  }

  return (
    <div 
      className='card'
      style={cardStyle}
      data-index={index}
      data-location={location}
      key={suit + number}
      onClick={handleClick}
    >
      {numberMap[number]}
      {suitsImages[suit]}
    </div>
  )
}
