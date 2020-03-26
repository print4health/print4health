import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FormControl, InputGroup, Button } from 'react-bootstrap';

class CommitModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thingId: props.thingId,
      quantity: 0,
      error: '',
      orders: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.increaseAmount = this.increaseAmount.bind(this);
    this.decreaseAmount = this.decreaseAmount.bind(this);
  }

  static get propTypes() {
    return {
      thingId: PropTypes.string,
    };
  }

  handleSubmit(e) {
    this.setState({ error: '' });
    e.preventDefault();
    const context = this.context;
    const self = this;
    console.log(context.order);
    axios.post(
      Config.apiBasePath + '/commitments',
      {
        orderId: context.order.id,
        quantity: this.state.quantity,
      },
    )
      .then(function (res) {
        context.setShowCommitModal(false, null);
        //update thing to show current quantities!
        context.setCurrentThing(res.data.commitment.order.thing);
        context.setAlert('Danke für Deinen Beitrag -  ist notiert.', 'success');
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

  increaseAmount() {
    this.setState({
      quantity: this.state.quantity + 1,
    });
  }

  decreaseAmount() {
    if (this.state.quantity <= 0) {
      return;
    }
    this.setState({
      quantity: this.state.quantity - 1,
    });
  }

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

        {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}
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
        <p>
          Um als Maker Herstellung von Ersatzteilen zusagen zu können, meldet euch unter <a
          href="mailto: contact@print4health.org">contact@print4health.org</a> und wir erstellen euch einen Account.
        </p>
        <p>
          Wenn ihr schon einen Account habt, meldet euch unter dem oben stehenden Anmelden-Link an,
          um Herstellung von Ersatzteilen zusagen zu können.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <input type="submit"
               className="btn btn-primary"
               value="OK"
               onClick={() => this.context.setShowCommitModal(false, null)} />
      </Modal.Footer>
    </>;
  }

  render() {
    return (
      <Modal show={this.context.showCommitModal}
             onHide={() => this.context.setShowCommitModal(false, null)}
             animation={false}
      >
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Herstellung zusagen</Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_MAKER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

CommitModal.contextType = AppContext;

export default CommitModal;
