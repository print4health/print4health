import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import { Modal } from 'react-bootstrap';

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
    const context = this.context;
    e.preventDefault();
    axios.post(Config.apiBasePath + '/request-password-reset', { email: this.state.email })
      .then(function () {
        context.setShowRequestPasswordResetModal(false);
        context.setAlert('Ein Link zum Zurücksetzen des Passworts wurde per email verschickt.', 'success');
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
      <Modal show={this.context.showRequestPasswordResetModal}
             onHide={() => this.context.setShowRequestPasswordResetModal(false)}
             animation={false}
      >
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Passwort zurücksetzen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}

            <div className="form-group">
              <input name="email"
                     type="email"
                     placeholder="E-Mail-Adresse"
                     className="form-control"
                     required
                     value={this.state.email}
                     onChange={this.handleInputChange} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <input type="submit" className="btn btn-primary" value="Link anfordern" />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

RequestPasswordResetModal.contextType = AppContext;

export default RequestPasswordResetModal;
