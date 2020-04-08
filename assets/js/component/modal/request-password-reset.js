import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import { Modal } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

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

  static get propTypes() {
    return {
      t: PropTypes.func
    };
  }

  handleSubmit(e) {
    this.setState({ error: '' });
    const self = this;
    const context = this.context;
    const { t } = this.props;
    e.preventDefault();
    axios.post(Config.apiBasePath + '/request-password-reset', { email: this.state.email })
      .then(function () {
        context.setShowRequestPasswordResetModal(false);
        context.setAlert(t('request.mailsend'), 'success');
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
    const { t } = this.props;
    return (
      <Modal show={this.context.showRequestPasswordResetModal}
             onHide={() => this.context.setShowRequestPasswordResetModal(false)}
             animation={false}
      >
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{t('request.title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}

            <div className="form-group">
              <input name="email"
                     type="email"
                     placeholder={t('request.placeholder')}
                     className="form-control"
                     required
                     value={this.state.email}
                     onChange={this.handleInputChange} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <input type="submit" className="btn btn-primary" value={t('request.button')} />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

RequestPasswordResetModal.contextType = AppContext;

export default withTranslation('password')(RequestPasswordResetModal);
