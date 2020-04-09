import React from 'react';
import AppContext from '../../context/app-context';
import { Alert, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    return <>
      <Modal.Body>
        <h6>
          Toll dass Du mithilfst!
        </h6>

        <p>
          Bitte trage nur eine Anzahl ein, die Du wirklich bereit und in der Lage bist herzustellen.
        </p>
        <p>
          Du kannst zu einem späteren Zeitpunkt immer noch mehr Teile zusagen.
        </p>

        <InputGroup className="mb-3">
          <FormControl
            type="number"
            name="quantity"
            placeholder="Anzahl"
            required
            aria-label="Anzahl der Teile"
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
          Herstellung zusagen
          <i className="fas fa-plus-circle fa-fw"></i>
        </Button>
      </Modal.Footer>
    </>;
  }

  renderInfo() {
    return <>
      <Modal.Body>
        <Alert variant="info">
          Um als Maker Herstellung von Ersatzteilen zusagen zu können, könnt ihr euch
          <Link to="/registration/maker" className="btn btn-link" onClick={this.onHide}>hier registrieren.</Link>
        </Alert>
        <p>
          Wenn ihr schon einen Account habt, meldet euch unter dem oben stehenden Anmelden-Link an,
          um Herstellung von Ersatzteilen zusagen zu können.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Link className="btn btn-outline-primary"
              to="/registration"
              onClick={this.onHide}>
          Registrieren
        </Link>
        <input type="submit"
               className="btn btn-light"
               value="Schließen"
               onClick={this.onHide} />
      </Modal.Footer>
    </>;
  }

  render() {
    const { show, thing } = this.state;
    return (
      <Modal show={show}
             onHide={this.onHide}
             onExited={this.onExited}
             animation={true}
      >
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Herstellung für &quot;{thing.name}&quot; zusagen</Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_MAKER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

CommitModal.contextType = AppContext;

export default CommitModal;
