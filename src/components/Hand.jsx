import React from 'react'
import Card from './Card'

export default function Hand({hand, selected, handleSelect}) {

  const sortedHand = hand.sort((a, b) => b.number - a.number)

  return (
    <div className='hand'>
      {sortedHand.map((card, index) => {
        return (
          <Card
            card={card}
            index={index}
            selected={selected === index ? true : false}
            handleClick={handleSelect}
          />
        )
      })}
    </div>
  )
}