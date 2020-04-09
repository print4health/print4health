import React from 'react';
import AppContext from '../../context/app-context';
import { Alert, Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
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
      t: PropTypes.func
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
          {t('form.part1')}
        </p>
        <p>
          {t('form.part2')}
        </p>

        <InputGroup className="mb-3">
          <FormControl
            type="number"
            name="quantity"
            placeholder={t('form.input')}
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
        <Button type="submit" variant="outline-primary" disabled={this.state.quantity <= 0}>
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
          {t('info.part1')} <Link
          to="/registration" onClick={this.onHide}>{t('info.link1')}</Link>.
          {t('info.part2')}<br />
          <br />
          {t('info.part3')} <a href="mailto: contact@print4health.org">contact@print4health.org</a> {t('info.part4')} <Link to="/contact" onClick={this.onHide}>{t('info.link2')}</Link>.
        </Alert>
        <p>{t('info.part5')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Link className="btn btn-outline-primary"
              to="/registration"
              onClick={this.onHide}>
          Registrieren
        </Link>
        <input type="submit"
               className="btn btn-primary"
               value={t('info.button')}
               onClick={this.onHide} />
      </Modal.Footer>
    </>;
  }

  render() {
    const { show, thing } = this.state;
    const { t } = this.props;
    return (
      <Modal
        show={show}
        onHide={this.onHide}
        onExited={this.onExited}
        animation={true}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{t('title.part1')} &quot;{thing.name}&quot; {t('title.part2')}</Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_REQUESTER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

OrderModal.contextType = AppContext;

export default withTranslation('order')(OrderModal);
