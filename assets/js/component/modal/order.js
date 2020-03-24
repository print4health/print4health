import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

class OrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thingId: props.thingId,
      quantity: 0,
      error: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    axios.post(
      Config.apiBasePath + '/orders',
      {
        thingId: this.state.thingId,
        quantity: this.state.quantity,
      },
    )
      .then(function (res) {
        context.setShowOrderModal(false);
        context.setCurrentThing(res.data.order.thing);
        context.setAlert('Danke, der Bedarf wurde eingetragen', 'success');
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

  renderForm() {
    return <>
      <Modal.Body>
        {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}
        <div className="form-group">
          <input name="quantity"
                 type="number"
                 placeholder="Anzahl"
                 className="form-control"
                 required
                 value={this.state.quantity}
                 onChange={this.handleInputChange} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <input type="submit" className="btn btn-primary" value="Bedarf eintragen" />
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
               onClick={() => this.context.setShowOrderModal(false)} />
      </Modal.Footer>
    </>;
  }

  render() {
    return (
      <Modal show={this.context.showOrderModal} onHide={() => this.context.setShowOrderModal(false)} animation={false}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Bedarf eintragen</Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_REQUESTER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

OrderModal.contextType = AppContext;

export default OrderModal;
