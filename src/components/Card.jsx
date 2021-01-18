import React from 'react'

export default function Card({card:{suit, number}, index}) {
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

  const cardStyle = {
    color: (suit === 'S' || suit === 'C') ? 'black' : 'red',
    // border: selected ? '4px solid green' : '1px solid black'
  }

  return (
    <div 
      className='card'
      style={cardStyle}
    >
      {numberMap[number]}
      {suitsImages[suit]}
    </div>
  )
}