import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import { Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

class CommitModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thingId: props.thingId,
      orderId: null,
      quantity: 0,
      error: '',
      orders: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static get propTypes() {
    return {
      thingId: PropTypes.string,
    };
  }

  componentDidMount() {
    const self = this;
    axios.get(Config.apiBasePath + '/orders/thing/' + this.state.thingId)
      .then((res) => {
        if (!Array.isArray(res.data.orders)) {
          return;
        }
        self.setState({ orders: res.data.orders });
        try {
          self.setState({ orderId: res.data.orders[0].id });
        } catch (e) {
          return;
        }
      })
      .catch((error) => {
        self.setState({
          error: error.response.data.error,
        });
      });
  }

  handleSubmit(e) {
    this.setState({ error: '' });
    e.preventDefault();
    const context = this.context;
    const self = this;
    axios.post(
      Config.apiBasePath + '/commitments',
      {
        orderId: this.state.orderId,
        quantity: this.state.quantity,
      },
    )
      .then(function (res) {
        context.setShowCommitModal(false);
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

  renderForm() {
    return <>
      <Modal.Body>
        {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}
        <div className="form-group">
          <Form.Control as="select" onChange={(e) => this.setState({ orderId: e.target.value })}>
            {
              this.state.orders.map((order, i) => {
                return <option key={i} value={order.id}>{i} - {order.requester.name}</option>;
              })
            }
          </Form.Control>
        </div>

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
        <input type="submit" className="btn btn-primary" value="Beitrag eintragen" />
      </Modal.Footer>
    </>;
  }

  renderInfo() {
    return <>
      <Modal.Body>
        <p>
          Noch ist kein Bedarf für dieses Ersatzteil eingetragen. Wenn es soweit ist, kannst Du an dieser darauf
          reagieren und Ersatzteile herstellen.
        </p>
        <p>
          Um Dich als Maker/Drucker/Printer anmelden zu können , melde Dich unter <a
          href="mailto: contact@print4health.org">contact@print4health.org</a> und wir
          erstellen Dir einen Account.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <input type="submit"
               className="btn btn-primary"
               value="OK"
               onClick={() => this.context.setShowCommitModal(false)} />
      </Modal.Footer>
    </>;
  }

  render() {
    return (
      <Modal show={this.context.showCommitModal}
             onHide={() => this.context.setShowCommitModal(false)}
             animation={false}
      >
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Bedarf eintragen</Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_MAKER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

CommitModal.contextType = AppContext;

export default CommitModal;
