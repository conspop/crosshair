import React from 'react'

export default function Card({card, index, handleClick, selected, lastPlayed}) {
  const {suit, number} = card

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

  const suitsImages = {
    'S':<i className="fas fa-spade"></i>,
    'C':<i className="fas fa-club"></i>,
    'H':<i className="fas fa-heart"></i>,
    'D':<i className="fas fa-diamond"></i>
  }

  let cardBorder
  if (selected) {
    cardBorder = '4px solid green'
  } else if (lastPlayed) {
    cardBorder = '4px solid black'
  } else {
    cardBorder = '1px solid black'
  }

  const cardStyle = {
    backgroundColor: (card === '') ? 'lightgrey' : 'white',
    color: (suit === 'S' || suit === 'C') ? 'black' : 'red',
    border: cardBorder
  }

  return (
    <div 
      className='card'
      style={cardStyle}
      onClick={handleClick}
      data-index={index}
    >
      {numberMap[number]}
      {suitsImages[suit]}
    </div>
  )
}