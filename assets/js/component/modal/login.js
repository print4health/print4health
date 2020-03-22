import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import $ from 'jquery';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectHome: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    const self = this;
    this.setState({ error: '' });
    e.preventDefault();
    axios.post(Config.apiBasePath + '/login', this.state)
      .then(function () {
        $('#modal-login').modal('hide');
        window.location.reload(true);
        self.setState({
          redirectHome: true,
        });
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
      <div className="modal fade" id="modal-login" tabIndex="-1" role="dialog">
        <form onSubmit={this.handleSubmit}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
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
              </div>
              <div className="modal-footer">
                <input type="submit" className="btn btn-primary" value="Login" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginModal;
