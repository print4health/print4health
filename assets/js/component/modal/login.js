import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import Markdown from 'react-remarkable';
import AppContext from '../../context/app-context';
import { Modal } from 'react-bootstrap';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

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

  static get propTypes() {
    return {
      onClose: PropTypes.func,
      t: PropTypes.func,
    };
  }

  componentDidMount() {
    ReactGA.modalview('/login/show');
  }

  handleSubmit(e) {
    const { onClose } = this.props;

    this.setState({ error: '' });
    e.preventDefault();
    const context = this.context;
    const self = this;
    const { t } = this.props;
    axios.post(Config.apiBasePath + '/login', this.state)
      .then(function (res) {
        context.setUser(res.data);
        onClose();
        context.setAlert(t('welcome') + ' ' + res.data.email, 'success');
      })
      .catch(function (error) {
        self.setState({
          error: error.response.data.message,
        });
      });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  renderError() {
    const { error } = this.state;

    if (error === '') {
      return '';
    }

    return (
      <div className="alert alert-danger">{error}</div>
    );
  }

  render() {
    const { t } = this.props;
    return (

      <Modal show onHide={this.props.onClose} animation={false}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title data-cypress="modal-login-title">{t('title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <h6>
              <Markdown>{t('headline')}</Markdown>
            </h6>

            {this.renderError()}

            <div className="form-group">
              <input name="email"
                     type="email"
                     placeholder={t('email')}
                     className="form-control"
                     required
                     value={this.state.email}
                     onChange={this.handleInputChange} />
            </div>
            <div className="form-group">
              <input name="password"
                     type="password"
                     placeholder={t('pass')}
                     className="form-control"
                     required
                     value={this.state.password}
                     onChange={this.handleInputChange} />
            </div>
            <p>
              <a href="#"
                 data-toggle="modal"
                 data-cypress="modal-login-reset-password"
                 onClick={(e) => {
                   e.preventDefault();
                   this.props.onClose();
                   this.context.setShowRequestPasswordResetModal(true);
                 }}
              >
                {t('forgot')}
              </a>
            </p>

            <div className="text-muted">
              <Markdown>{t('registration', { link: '#/registration' })}</Markdown>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <input type="submit" className="btn btn-primary" value={t('button')} />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

LoginModal.contextType = AppContext;

export default withTranslation('modal-login')(LoginModal);
