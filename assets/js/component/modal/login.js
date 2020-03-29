import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
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
    axios.post(Config.apiBasePath + '/login', this.state)
      .then(function (res) {
        context.setUser(res.data);
        onClose();
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
    const { t, i18n } = this.props;
    return (

      <Modal show onHide={this.props.onClose} animation={false}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{t('title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <h6>
            {t('info1.part1')}
              <br />
              {t('info1.part2')}
            </h6>

            <p>
            {t('info1.part3')} <a href="mailto: contact@print4health.org">contact@print4health.org</a> {t('info1.part4')}
            </p>
            <p>
            {t('info1.part5')}

            </p>

            {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}

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
                 onClick={() => {
                   this.props.onClose();
                   this.context.setShowRequestPasswordResetModal(true);
                 }}
              >
                {t('forgot')}
              </a>
            </p>

            <p className="text-muted">
              {t('info2')}
            </p>
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

export default withTranslation('login')(LoginModal);
