import React from 'react';
import AppContext from '../../context/app-context';
import { Modal } from 'react-bootstrap';
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

  renderForm() {
    return <>
      <Modal.Body>
        <p>
          Bitte trage die Anzahl ein, die ihr aktuell wirklich benötigt.
        </p>
        <p>
          Du kannst zu einem späteren Zeitpunkt immer noch mehr Teile bestellen.
        </p>

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
    const { show, thing } = this.state;
    return (
      <Modal
        show={show}
        onHide={this.onHide}
        onExited={this.onExited}
        animation={true}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Bedarf für "{thing.name}" eintragen</Modal.Title>
          </Modal.Header>
          {this.context.getCurrentUserRole() === 'ROLE_REQUESTER' ? this.renderForm() : this.renderInfo()}
        </form>
      </Modal>
    );
  }
}

OrderModal.contextType = AppContext;

export default OrderModal;
