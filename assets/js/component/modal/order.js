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

  componentDidMount() {
    const context = this.context;
    axios.get(Config.apiBasePath + '/user/profile')
      .then((res) => {
        context.setUser(res.data);
      })
      .catch(() => {
        context.setUser({});
      });
  }

  handleSubmit(e) {
    this.setState({ error: '' });
    e.preventDefault();
    const context = this.context;
    const self = this;
    axios.post(Config.apiBasePath + '/orders', this.state)
      .then(function () {
        context.setShowOrderModal(false);
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

  render() {
    return (
      <Modal show={this.context.showOrderModal} onHide={() => this.context.setShowOrderModal(false)} animation={false}>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Bedarf eintragen</Modal.Title>
          </Modal.Header>
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
        </form>
      </Modal>
    );
  }
}

OrderModal.contextType = AppContext;

export default OrderModal;
