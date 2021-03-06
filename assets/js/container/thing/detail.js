import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import PropTypes from 'prop-types';
import AppContext from '../../context/app-context';
import OrderModal from '../../component/modal/order';
import CommitModal from '../../component/modal/commit';
import RequirementMap from '../../component/map/requirement-map';
import ReactGA from 'react-ga';
import { withTranslation } from 'react-i18next';

class ThingDetailContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      error: null,
      currentOrder: null,
      isLoaded: false,
      showSpecs: false,
      showCommitModal: false,
      showOrderModal: false,
    };
  }

  static get propTypes() {
    return {
      match: PropTypes.object,
      id: PropTypes.string,
      t: PropTypes.func
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

  openCommitModal = (order) => {
    ReactGA.modalview('/commit/show');
    this.setState({
      showCommitModal: true,
      currentOrder: order,
    });
  };

  onCloseCommitModal = () => {
    this.setState({
      showCommitModal: false,
      currentOrder: null,
    });
  };

  openOrderModal = () => {
    ReactGA.modalview('/order/show');
    this.setState({
      showOrderModal: true,
    });
  };

  onCloseOrderModal = () => {
    this.setState({
      showOrderModal: false,
    });
  };

  createCommitment = (quantity) => {
    const { t } = this.props;
    axios.post(
      Config.apiBasePath + '/commitments',
      {
        orderId: this.state.currentOrder.id,
        quantity: quantity,
      },
    )
      .then(() => {
        ReactGA.event({
          category: 'Commitment',
          action: 'commitment.create',
          value: this.context.currentThing.id
        });
        this.onCloseCommitModal();
        this.loadThing(false);
        this.loadOrders();
        this.context.setAlert(t('commitmentmade'), 'success');
      })
      .catch(error => {
        this.setState({
          error: error.response.data.error,
        });
      });
  };

  createOrder = (quantity) => {
    const { t } = this.props;
    axios.post(
      Config.apiBasePath + '/orders',
      {
        thingId: this.context.currentThing.id,
        quantity: quantity,
      },
    )
      .then(() => {
        ReactGA.event({
          category: 'Order',
          action: 'Order.create',
          value: this.context.currentThing.id
        });
        this.onCloseOrderModal();
        this.loadThing(false);
        this.loadOrders();
        this.context.setAlert(t('ordermade'), 'success');
      })
      .catch(error => {
        self.setState({
          error: error.response.data.error,
        });
      });
  };

  renderSpecification() {
    const thing = this.context.currentThing;
    const { t } = this.props;

    if (thing.specification.length > 0) {
      return (
        <div className="specs">{thing.specification}</div>
      );
    }
    if (thing.specification.length === 0) {
      return (
        <div className="specs">{t('nospecs')}</div>
      );
    }
  }

  render() {
    const {
      error,
      orders,
      isLoaded,
      showSpecs,
      currentOrder,
      showCommitModal,
      showOrderModal,
    } = this.state;
    const thing = this.context.currentThing;
    const { t } = this.props;

    if (error) {
      return <div className="alert alert-danger">{t('error')}: {error.message}</div>;
    }
    if (!isLoaded) {
      return <div>{t('loading')}</div>;
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
                <strong className="text-uppercase">{t('specs')}:</strong>
              </div>
              <a className="btn btn-link">
                {showSpecs && <i className="fas fa-chevron-up fa-fw"></i>}
                {!showSpecs && <i className="fas fa-chevron-down fa-fw"></i>}
              </a>
            </div>
            {showSpecs && this.renderSpecification()}
          </div>
          <div className="col-md-6 col-map">
            <RequirementMap thing={thing} orders={orders} openModal={this.openCommitModal} />
          </div>
          <div className="col-md-3 col-order">
            <div className="media requests">
              <div className="media-body">
                <span className="mr-1">{t('need')}:</span>
                <strong className="text-primary">{thing.needed}</strong>
              </div>
            </div>
            <div className="media requests mb-2">
              <div className="media-body">
                <button className="btn btn-outline-primary" onClick={this.openOrderModal} data-cypress="place-order">
                  {t('order')}
                  <i className="ml-2 fas fa-plus-circle fa-fw"></i>
                </button>
              </div>
            </div>
            <small className="text-muted">
              {t('hospinfo')}
            </small>
            <div className="media">
              <div className="media-body">
                <span className="mr-1">{t('prints')}:</span>
                <strong className="text-secondary">{thing.printed}</strong>
              </div>
            </div>
            <small className="text-muted">
              {t('makerinfo')}
            </small>
            <a className="media" href={thing.url} target="_blank" rel="noopener noreferrer">
              <div className="media-body">
                <strong className="text-uppercase">{t('downloads')}</strong>
              </div>
              <span className="btn btn-link btn-large">
                <i className="fas fa-arrow-alt-circle-down fa-fw"></i>
              </span>
            </a>
          </div>
        </div>
        {showOrderModal && <OrderModal thing={thing}
                                       onSubmit={this.createOrder}
                                       onExited={this.onCloseOrderModal} />}
        {showCommitModal && <CommitModal thing={thing}
                                         order={currentOrder}
                                         onSubmit={this.createCommitment}
                                         onExited={this.onCloseCommitModal} />}
      </div>

    );
  }
}

ThingDetailContainer.contextType = AppContext;

export default withTranslation('page-thing-detail')(ThingDetailContainer);
