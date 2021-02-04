import React from 'react'
import { Link } from 'react-router-dom'

export default function Header({user, handleLogout}) {

  return (
    <>
        <div div><i class="fas fa-crosshairs"></i></div>
        {user ?
          <div className='header-nav'>
            <Link to='/lobby'>Lobby</Link>
            <Link to='/games'>Games</Link>
            <Link to='/leaderboard'>Ranks</Link>
          </div>
          : 
          <div className='header-nav'>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Signup</Link>
          </div>}
        <div style={{width: '4rem', display:'flex', justifyContent:'space-between'}}>
          <div><Auth user={user} handleLogout={handleLogout} /></div>
          <Link to='/how-to-play'><i class="fas fa-question-circle"></i></Link>
        </div>
        
    </>
  )
}

function Auth({user, handleLogout}) {
  if (user) {
    return (
      <>
        <Link to='' onClick={handleLogout}><i class="fas fa-sign-out-alt"></i></Link>
      </>
    )
  } else {
    return false
  }
}

