import React from 'react';
import AppContext from '../../context/app-context';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class CommitModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      thing: props.thing,
      quantity: 0,
      errors: '',
      orders: [],
    };
  }

  static get propTypes() {
    return {
      thing: PropTypes.object,
      order: PropTypes.object,
      onExited: PropTypes.func,
      onSubmit: PropTypes.func,
      t: PropTypes.func,
      i18n: PropTypes.object
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
        <h6>
          {t('form.title')}
        </h6>

        <p>
          {t('form.text1')}
        </p>
        <p>
          {t('form.text2')}
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
            <Button variant="outline-secondary" onClick={this.increaseAmount}> + </Button>
            <Button variant="outline-secondary" onClick={this.decreaseAmount}> - </Button>
          </InputGroup.Append>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant="outline-secondary" disabled={this.state.quantity <= 0}>
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
        <p>
          {t('info.text1')}
          <Link to="/register/maker" className="btn btn-link" onClick={this.onHide}>{t('info.link')}</Link>.
        </p>
        <p>
          {t('info.text2')}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <input type="submit"
               className="btn btn-light"
               value={t('info.button')}
               onClick={this.onHide} />
      </Modal.Footer>
    </>;
  }

  render() {
    const { show, thing } = this.state;
    const { t } = this.props;
    return (
      <Modal show={show}
             onHide={this.onHide}
             onExited={this.onExited}
             animation={true}
      >
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{t('title.part1')} &quot;{thing.name}&quot; {t('title.part2')}</Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_MAKER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

CommitModal.contextType = AppContext;

export default withTranslation('commit')(CommitModal);
