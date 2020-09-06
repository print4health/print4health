import React from 'react';
import AppContext from '../../context/app-context';
import { Alert, Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import Markdown from 'react-remarkable';
import { Link } from 'react-router-dom';

class OrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      thing: props.thing,
      quantity: 0,
      error: '',
    };
  }

  static get propTypes() {
    return {
      thing: PropTypes.object,
      onExited: PropTypes.func,
      onSubmit: PropTypes.func,
      t: PropTypes.func,
    };
  }

  onHide = () => {
    this.setState({
      show: false,
    });
  };

  onExited = () => {
    this.props.onExited();
    if (this.state.quantity > 0) {
      this.props.onSubmit(this.state.quantity);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      show: false,
    });
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  increaseAmount = () => {
    this.setState({
      quantity: parseInt(this.state.quantity) + 1,
    });
  };

  decreaseAmount = () => {
    if (this.state.quantity <= 0) {
      return;
    }
    this.setState({
      quantity: parseInt(this.state.quantity) - 1,
    });
  };

  renderForm() {
    const { t } = this.props;
    return <>
      <Modal.Body>
        <p>
          {t('form.description')}
        </p>

        <InputGroup className="mb-3">
          <FormControl
            type="number"
            name="quantity"
            placeholder={t('form.placeholder')}
            required
            aria-label={t('form.label')}
            aria-describedby="basic-addon2"
            value={this.state.quantity}
            onChange={this.handleInputChange}
          />
          <InputGroup.Append>
            <Button variant="outline-primary" onClick={this.increaseAmount}> + </Button>
            <Button variant="outline-primary" onClick={this.decreaseAmount}> - </Button>
          </InputGroup.Append>
        </InputGroup>

      </Modal.Body>
      <Modal.Footer>
        <Button type="submit"
                variant="outline-primary"
                data-cypress="modal-order-submit"
                disabled={this.state.quantity <= 0}>
          {t('form.button')}
          <i className="fas fa-plus-circle fa-fw"></i>
        </Button>
      </Modal.Footer>
    </>;
  }

  renderInfo() {
    const { t } = this.props;
    return <>
      <Modal.Body>
        <Alert variant="info">
          <div data-cypress="modal-order-info">
            <Markdown>
              {t('info.alert', {
                link_registration: '#/registration',
                link_contact_form: '#/contact'
              })}
            </Markdown>
          </div>
        </Alert>
        <p>{t('info.account_exists')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Link className="btn btn-outline-primary"
              to="/registration"
              onClick={this.onHide}>
          {t('button.register')}
        </Link>
        <input type="submit"
               className="btn btn-primary"
               data-cypress="modal-order-close"
               value={t('button.close')}
               onClick={this.onHide} />
      </Modal.Footer>
    </>;
  }

  render() {
    const { show, thing } = this.state;
    return (
      <Modal
        show={show}
        onHide={this.onHide}
        onExited={this.onExited}
        animation={true}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <Trans i18nKey="modal-order:title">
                Confirm the order of thing {{ name: thing.name }}
              </Trans>
            </Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_REQUESTER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

OrderModal.contextType = AppContext;

export default withTranslation('modal-order')(OrderModal);
