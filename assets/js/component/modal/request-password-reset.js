import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import $ from 'jquery';
import AppContext from '../../context/app-context';

class RequestPasswordResetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    this.setState({ error: '' });
    const self = this;
    e.preventDefault();
    axios.post(Config.apiBasePath + '/request-password-reset', { email: this.state.email })
      .then(function () {
        $('#modal-request-passwort-reset').modal('hide');
        self.context.setAlert('Ein Link zum Zurücksetzen des Passworts wurde per email verschickt.', 'success');
      })
      .catch(function (error) {
        self.setState({
          error: error.response.data.errors.join(', '),
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
      <div className="modal fade" id="modal-request-passwort-reset" tabIndex="-1" role="dialog">
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
              </div>
              <div className="modal-footer">
                <input type="submit" className="btn btn-primary" value="Link anfordern" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

RequestPasswordResetModal.contextType = AppContext;

export default RequestPasswordResetModal;
