import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

const suitsImages = {
  'S':<i class="fas fa-spade"></i>,
  'C':<i class="fas fa-club"></i>,
  'H':<i class="fas fa-heart"></i>,
  'D':<i class="fas fa-diamond"></i>
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
  const [gameId, setGameId] = useState('')
  const [playerOneName, setPlayerOneName] = useState('')
  const [playerTwoName, setPlayerTwoName] = useState('')
  const [turn, setTurn] = useState('')
  const [hand, setHand] = useState('')
  const [board, setBoard] = useState('')

  const putNameInState = (name) => {
    setName(name)
  }

  const newGame = (data) => {
    setPlayerOneName(data.playerOneName)
    setPlayerTwoName(data.playerTwoName)
    setHand(data.playerOneHand)
    setBoard(data.board)
    setGameId(data.gameId)
  }
  
  return (
    gameId === ''
    ?
    <CreateOrJoinGame 
      newGame={newGame} 
      putNameInState={putNameInState}
    />
    :
    <Game 
      hand={hand}
      board={board}
    />
  )
} 

function CreateOrJoinGame({newGame, putNameInState}) {
  const [username, setUsername] = useState('')

  const createGame = () => {
    putNameInState(username)
    axios.post('/games', {
      username
    })
    .then(res => {
      newGame(res.data)
    })
    .catch(err => console.log(err.message))
  }

  return (
    <>
      <div>
        <label>Name: </label>
        <input type="text" onChange={event => setUsername(event.target.value)} />
        <button onClick={createGame}>Create Game</button>
      </div>
      <div>
        <label>Name: </label>
        <input />
        <label>Game Id: </label>
        <input />
        <button>Join Game</button>
      </div>
    </>
  )
}

function Game({ hand, board}) {
  const [selected, setSelected] = useState('')

  const selectCard = (index) => {
    if (parseInt(index) === selected) {
      setSelected('')
    } else {
      setSelected(parseInt(index))
    }
  }

  return (
    <div className='game-container'>
      <div className='title'>Crossfire</div>
      <div className='message'>Seb's Turn</div>
      <div className='board'>
        {board.map((card, index) => <Card card={card} index={index} location='board' />)}
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
  const {index, location, selected, selectCard} = props

  const cardColor = {
    color: (suit === 'S' || suit === 'C') ? 'black' : 'red',
    border: selected ? '4px solid green' : '1px solid black'
  }

  const handleClick = (event) => {
    const {location, index} = event.currentTarget.dataset
    if (location === 'hand') {
      selectCard(index)
    }
  }

  return (
    <div 
      className='card'
      style={cardColor}
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
