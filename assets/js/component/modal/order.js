import React from 'react';
import AppContext from '../../context/app-context';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

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
        <p>
          Bitte trage die Anzahl ein, die ihr aktuell wirklich benötigt.
        </p>
        <p>
          Du kannst zu einem späteren Zeitpunkt immer noch mehr Teile bestellen.
        </p>

        <InputGroup className="mb-3">
          <FormControl
            type="number"
            name="quantity"
            placeholder="Anzahl"
            required
            aria-label="Anzahl der benötigten Teile"
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
          Bedarf eintragen
          <i className="fas fa-plus-circle fa-fw"></i>
        </Button>
      </Modal.Footer>
    </>;
  }

  renderInfo() {
    return <>
      <Modal.Body>
        <p>
          Um als Gesundheits/Sozial-Einrichtung Bedarf an Ersatzteilen eintragen zu können, meldet euch unter <a
          href="mailto: contact@print4health.org">contact@print4health.org</a> und wir erstellen euch einen Account.
        </p>
        <p>Wenn ihr schon einen Account habt, meldet euch unter dem oben stehenden Anmelden-Link an um Bedarf
          einzutragen.</p>
      </Modal.Body>
      <Modal.Footer>
        <input type="submit"
               className="btn btn-primary"
               value="OK"
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
            <Modal.Title>Bedarf für &quot;{thing.name}&quot; eintragen</Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_REQUESTER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

OrderModal.contextType = AppContext;

export default OrderModal;
