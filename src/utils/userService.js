import tokenService from './tokenService'
import axios from 'axios'

const BASE_URL = '/users/';

const functions = {
  signup,
  getUser,
  logout,
  login, 
  getData
}

export default functions

function signup(user) {
  return fetch(BASE_URL + 'signup', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body:JSON.stringify(user)
  })
  .then(res => {
    if (res.ok) return res.json();
    throw new Error('Username already taken.');
  })
  .then(({token}) => {
    tokenService.setToken(token);
  })
}

function getUser() {
  return tokenService.getUserFromToken();
}

function logout() {
  tokenService.removeToken();
}

function login(creds) {
  return fetch(BASE_URL + 'login', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(creds)
  })
  .then(res => {
    // Valid login if we have a status of 2xx (res.ok)
    if (res.ok) return res.json();
    throw new Error('Incorrect username or password.');
  })
  .then(({token}) => tokenService.setToken(token));
}

async function getData() {
  return await axios.get('/api/data', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + tokenService.getToken()
    }
  })
  .then(res => {
    return res.data
  })
  .catch(err => console.log(err.message))
}
