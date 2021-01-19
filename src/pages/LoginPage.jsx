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
      <div className='login-page-container'>
        <div className='page-container form'>
          <div className='login-form form-child'>
            <label>
              Username
              <input 
                name='username'
                value={this.state.username}
                onChange={this.handleChange}
              />
            </label>
            <label>
              Password 
              <input 
                name='password'
                value={this.state.password}
                onChange={this.handleChange}
                type='password'
              />
            </label> 
            {
              this.state.message ?
              <div className='login-message'>
                {this.state.message}
              </div> 
              :
              ''
            }
          </div>
          <div className="button-container">
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
        </div>
      </div>
    )
  }
}

export default LoginForm