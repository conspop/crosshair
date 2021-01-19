import React from 'react'
import Card from './Card'

export default function Hand({hand, selected, handleSelect}) {
  return (
    <div className='hand'>
      {hand.map((card, index) => {
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