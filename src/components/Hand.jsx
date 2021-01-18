import React from 'react'
import Card from './Card'

export default function Hand({hand}) {
  return (
    <div>
      {hand.map(card => {
        return (
          <Card
            card={card}
          />
        )
      })}
    </div>
  )
}