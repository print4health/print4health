import React from 'react';
import { Config } from '../../config';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    console.log(Config.apiBasePath);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <div className="Login">
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input name="email"
                   type="email"
                   placeholder="email"
                   className="form-control"
                   required
                   value={this.state.email}
                   onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <input name="password"
                   type="password"
                   placeholder="password"
                   className="form-control"
                   required
                   value={this.state.password}
                   onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <input type="submit" className="btn btn-primary" value="Login" />
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
