import React from 'react'
import { Link } from 'react-router-dom'

export default function Header({user, handleLogout}) {

  return (
    <>
      <div className='flex-h space-between'>
        <div>CROSSHAIR</div>
        <div><Auth user={user} handleLogout={handleLogout} /></div>
      </div>
      {/* <div className='flex-h space-evenly'>
        <Link to='/staples'>Staples</Link>
        <Link to='/recipes'>Recipes</Link>
        <Link to='/lists'>Lists</Link>
      </div> */}
    </>
  )
}

function Auth({user, handleLogout}) {
  if (user) {
    return (
      <>
        Hi {user.username}!&nbsp;&nbsp;&nbsp;
        <Link to='' onClick={handleLogout}>Log Out</Link>
      </>
    )
  } else {
    return (
      <>
        <Link to='/login'>Log In</Link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to='/signup'>Sign Up</Link>
      </>
    )
  }
}

