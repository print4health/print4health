import React from 'react';
import { Config } from '../../config';
import axios from 'axios';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const self = this;
    this.setState({ error: '' });
    e.preventDefault();
    axios.post(Config.apiBasePath + '/login', this.state)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        self.setState({
          error: error.response.data.error,
        });
      });
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

          {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}

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
