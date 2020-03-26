import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import PropTypes from 'prop-types';
import AppContext from '../../context/app-context';
import OrderModal from '../../component/modal/order';
import CommitModal from '../../component/modal/commit';
import RequirementMap from '../../component/map/requirement-map';
import ReactGA from 'react-ga';

class ThingDetailContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      thing: null,
      error: null,
      currentOrder: null,
      isLoaded: false,
      showSpecs: false,
      commitModalOpen: false,
    };
  }

  static get propTypes() {
    return {
      match: PropTypes.object,
      id: PropTypes.string,
    };
  }

  toggleSpecs = (event) => {
    event.preventDefault();
    this.setState(state => ({
      showSpecs: !state.showSpecs,
    }));
  };

  componentDidMount() {
    this.loadThing(true);
    this.loadOrders();
  }

  loadThing(sendGa) {
    const { id } = this.props.match.params;
    axios.get(Config.apiBasePath + '/things/' + id)
      .then((res) => {
        this.context.setCurrentThing(res.data.thing);
        this.setState({
          isLoaded: true,
        });
        if (sendGa) {
          this.context.setPageTitle('Bedarf / ' + res.data.thing.name);
          const path = window.location.pathname + window.location.hash.substr(2);
          ReactGA.pageview(path, document.title);
        }
      })
      .catch((error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      });
  }

  loadOrders() {
    const { id } = this.props.match.params;
    axios.get(Config.apiBasePath + '/things/' + id + '/orders')
      .then((res) => {
        if (!Array.isArray(res.data.orders)) {
          return;
        }
        this.setState({ orders: res.data.orders });
      })
      .catch((error) => {
        this.setState({
          error: error.response.data.error,
        });
      });
  }

  onCloseModal = () => {
    this.setState({
      commitModalOpen: false,
      currentOrder: null,
    });
  };

  createCommitment = (quantity) => {
    axios.post(
      Config.apiBasePath + '/commitments',
      {
        orderId: this.state.currentOrder.id,
        quantity: quantity,
      },
    )
      .then(res => {
        this.onCloseModal();
        this.loadThing(false);
        this.loadOrders();
        this.context.setAlert('Danke für Deinen Beitrag -  ist notiert.', 'success');
      })
      .catch(error => {
        this.setState({
          error: error.response.data.error,
        });
      });
  };

  renderSpecification() {
    const thing = this.context.currentThing;

    if (thing.specification.length > 0) {
      return (
        <div className="specs">{thing.specification}</div>
      );
    }
    if (thing.specification.length === 0) {
      return (
        <div className="specs">Noch keine Spezifikation enthalten.</div>
      );
    }
  }

  openModal = (order) => {
    this.setState({
      commitModalOpen: true,
      currentOrder: order,
    });
  };

  render() {
    const {
      error,
      orders,
      isLoaded,
      showSpecs,
      currentOrder,
      commitModalOpen,
    } = this.state;
    const thing = this.context.currentThing;

    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
    }
    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return (
      <div className="ThingListDetail">
        <div className="row">
          <div className="col-md-12">
            <h2>{thing.name}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 thing-info">
            <img src={thing.imageUrl} alt={thing.name} />
            <div className="description mt-3">
              <p>{thing.description}</p>
            </div>
            <div className="media" onClick={this.toggleSpecs}>
              <div className="media-body">
                <strong className="text-uppercase">Spezifikationen:</strong>
              </div>
              <a className="btn btn-link">
                {showSpecs && <i className="fas fa-chevron-up fa-fw"></i>}
                {!showSpecs && <i className="fas fa-chevron-down fa-fw"></i>}
              </a>
            </div>
            {showSpecs && this.renderSpecification()}
          </div>
          <div className="col-md-6 col-map">
            <RequirementMap thing={thing} orders={orders} openModal={this.openModal} />
          </div>
          <div className="col-md-3 col-order">
            <div className="media">
              <div className="media-body">
                <span className="mr-1">Bedarf gesamt:</span>
                <strong className="text-primary">{thing.needed}</strong>
              </div>
              <button className="btn btn-link" onClick={() => this.context.setShowOrderModal(true)}>
                <i className="fas fa-plus-circle fa-fw text-primary"></i>
              </button>
            </div>
            <small className="text-muted">
              Um Bedarf an diesem Ersatzteil anzumelden,
              melde Dich mit deinem Einrichtungs-Account an und klicke auf das große rote +.
            </small>
            <div className="media">
              <div className="media-body">
                <span className="mr-1">Prints gesamt:</span>
                <strong className="text-secondary">{thing.printed}</strong>
              </div>
            </div>
            <small className="text-muted">
              Um Ersatzteile für Bestellungen herzustellen,
              melde Dich mit deinem Maker-Account an und klicke auf die Marker in
              der Karten-Ansicht.
            </small>
            <a className="media" href={thing.url} target="_blank" rel="noopener noreferrer">
              <div className="media-body">
                <strong className="text-uppercase">Downloads</strong>
              </div>
              <span className="btn btn-link">
                <i className="fas fa-arrow-alt-circle-down fa-fw"></i>
              </span>
            </a>
          </div>
        </div>
        <OrderModal thingId={thing.id} />
        {commitModalOpen && <CommitModal thingId={thing.id}
                                         order={currentOrder}
                                         onSubmit={this.createCommitment}
                                         onExited={this.onCloseModal} />}
      </div>

    );
  }
}

ThingDetailContainer.contextType = AppContext;

export default ThingDetailContainer;
