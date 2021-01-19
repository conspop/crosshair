import { Component } from 'react'

import userService from '../utils/userService'

class SignupPage extends Component {
  state = {
    username:'',
    password:'',
    confirmPassword:'',
    message:''
  }
  
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = async () => {
      try {
        await userService.signup(this.state)
        this.props.handleSignupOrLogin();
        this.props.history.push('/schedule')
      } catch (err) {
        this.setState({
          password:'',
          confirmPassword:'',
          message: err.message
        })
      }
    }
  
  isFormValid = () => {
    return (this.state.username && this.state.password !== '' && this.state.password === this.state.confirmPassword)
  }

  render() {
    return (
      <>
        <label>Username</label>
        <input 
          name='username'
          value={this.state.username}
          onChange={this.handleChange}
        />
        <label>Password</label> 
        <input 
          name='password'
          value={this.state.password}
          onChange={this.handleChange}
          type='password'
        />
        <label>Confirm Password</label>
        <input 
          name='confirmPassword'
          value={this.state.confirmPassword}
          onChange={this.handleChange}
          type='password'
        />
        {
          this.state.message !== '' ?
          <div className='signup-message'>{this.state.message}</div> :
          ''
        }
        <div className="button-container">
          <button
            className='add-button'
            onClick={this.handleSubmit}
            style={this.isFormValid() ? {} : {opacity:.5}}
            disabled={
              (!this.isFormValid())
            }
          >
            Sign Up
          </button>
        </div>
      </>
    )
  }
}

export default SignupPage