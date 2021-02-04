import React from 'react'
import userService from '../utils/userService'

class LoginForm extends React.Component {
  state = {
    username:'',
    password:'',
    message:''
  }
  
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = async () => {
      try {
        await userService.login(this.state)
        this.props.handleSignupOrLogin();
        this.props.history.push('/games')
      } catch (err) {
        this.setState({
          message: err.message,
          password:''
        })
      }
    }
  
  isFormValid = () => {
    return (this.state.username && this.state.password)
  }

  render() {
    return (
      <>
        <h1>Login</h1>
        <label style={{marginTop: '10px'}}>Username</label>
        <input 
          name='username'
          value={this.state.username}
          onChange={this.handleChange}
          style={{marginTop: '10px'}}
        />
        <label style={{marginTop: '10px'}}>Password</label> 
        <input 
          name='password'
          value={this.state.password}
          onChange={this.handleChange}
          type='password'
          style={{marginTop: '10px'}}
        />
        {
          this.state.message ?
          <div className='login-message'>
            {this.state.message}
          </div> 
          :
          ''
        }
        <div className="button-container" style={{marginTop: '10px'}}>
          <button
            className='add-button'
            onClick={this.handleSubmit}
            style={this.isFormValid() ? {} : {opacity:.5}}
            disabled={
              (!this.isFormValid())
            }
          >
            Login
          </button>
        </div>
      </>
    )
  }
}

export default LoginForm