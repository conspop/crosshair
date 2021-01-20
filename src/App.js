import React, { useState } from 'react'
import './App.css'
import { Switch, Route, Redirect } from 'react-router-dom'
import userService from './utils/userService'
import './App.css'

import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import GamesPage from './pages/GamesPage'
import GamePage from './pages/GamePage'
import LobbyPage from './pages/LobbyPage'
import HowToPlayPage from './pages/HowToPlayPage'

export default function App() {

  const [user, setUser] = useState(userService.getUser())

  const handleLogout = () => {
    userService.logout();
    setUser(null)
  }

  const handleSignupOrLogin = () => {
    setUser(userService.getUser());
  }

  return (
    <div className='app-container'>
      <Switch>
        <>
          <div className='header-container'>
            <Header 
              user={user} 
              handleLogout={handleLogout}
            />
          </div>
          <div className='page-container'>
            <Route exact path='/'>
              <Redirect to='/games' />
            </Route>
            <Route exact path='/signup' render={({history}) =>
              <SignupPage
                handleSignupOrLogin={handleSignupOrLogin} 
                history={history}
              />}
            />
            <Route exact path='/login' render={({history}) =>
              <LoginPage
                handleSignupOrLogin={handleSignupOrLogin} 
                history={history}
              />}
            />
            <Route exact path='/how-to-play'>
              <HowToPlayPage />
            </Route>
            <Route exact path='/lobby' render={() => (
              userService.getUser() ? <LobbyPage user={user} /> : <Redirect to ='/login' />
            )}/>
            <Route exact path='/games' render={() => (
              userService.getUser() ? <GamesPage user={user} /> : <Redirect to ='/login' />
            )}/>
            <Route exact path='/games/:gameId' render={() => (
              userService.getUser() ? <GamePage user={user} /> : <Redirect to ='/login' />
            )}/>
          </div>
        </>
      </Switch>
    </div>
  )
}
