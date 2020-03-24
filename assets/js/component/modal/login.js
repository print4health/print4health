import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import { Modal } from 'react-bootstrap';

class LoginModal extends React.Component {
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

  componentDidMount() {
    const context = this.context;
    axios.get(Config.apiBasePath + '/user/profile')
      .then((res) => {
        context.setUser(res.data);
      })
      .catch(() => {
        context.setUser({});
      });
  }

  handleSubmit(e) {
    this.setState({ error: '' });
    e.preventDefault();
    const context = this.context;
    const self = this;
    axios.post(Config.apiBasePath + '/login', this.state)
      .then(function (res) {
        context.setUser(res.data);
        context.setShowLoginModal(false);
        context.setAlert('Herzlich Willkommen ' + res.data.email, 'success');
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

      <Modal show={this.context.showLoginModal} onHide={() => this.context.setShowLoginModal(false)} animation={false}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Anmeldung bei print4health</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <h6>
              als Gesundheits/Sozial-Einrichtung<br />
              oder als Maker/Drucker/Printer
            </h6>

            <p>
              Schreibt eine E-Mail an <a href="mailto: contact@print4health.org">contact@print4health.org</a> und wir
              richten euch einen Benutzer-Account ein.
            </p>
            <p>
              Anschließend könnt ihr Bedarf an Ersatzteilen eintragen oder darauf reagieren und diese herstellen.
            </p>

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
            <p>
              <a href="#"
                 data-toggle="modal"
                 onClick={() => {
                   this.context.setShowLoginModal(false);
                   this.context.setShowRequestPasswordResetModal(true);
                 }}
              >
                Passwort vergessen?
              </a>
            </p>

            <p className="text-muted">
              Ein Registrierungsformular und Accounts für Maker/Drucker/Printer werden gerade vorbereitet.
              Gesundheits und Sozial-Einrichtungen können sofort starten.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <input type="submit" className="btn btn-primary" value=" Login" />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

LoginModal.contextType = AppContext;

export default LoginModal;
