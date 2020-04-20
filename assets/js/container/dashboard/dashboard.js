import React from 'react';
import AppContext from "../../context/app-context";
import {ROLE_MAKER, ROLE_REQUESTER} from '../../constants/UserRoles';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  static get propTypes() {
    return {
      t: PropTypes.func
    };
  }

  async fetchData() {
    const { user } = this.context;
    if (user.roles.includes(ROLE_REQUESTER)) {
      this.fetchDataByRequester();
    }
    if (user.roles.includes(ROLE_MAKER)) {
      this.fetchDataMaker();
    }
  }

  async fetchDataMaker() {
    const { data } = this.state;

    if (data !== null) {
      return;
    }

    try {
      const response = await fetch(`/orders/user`);

      if (response.status !== 200) {
        throw new Error();
      }

      const data = await response.json();

      this.setState({ data });
    } catch (e) {
      throw new Error();
    }
  }

  async fetchDataByRequester() {
    const { data } = this.state;

    if (data !== null) {
      return;
    }

    try {
      const response = await fetch(`/orders/user`);

      if (response.status !== 200) {
        throw new Error();
      }

      const data = await response.json();

      this.setState({ data });
    } catch (e) {
      throw new Error();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    this.fetchData();
  }

  getContactLink(order, makerOrRequester) {
    const { user } = this.context;
    if (user.roles.includes(ROLE_REQUESTER)) {
      return `/contact/${ROLE_MAKER}/${order.id}/${makerOrRequester.id}`;
    }

    if (user.roles.includes(ROLE_MAKER)) {
      return `/contact/${ROLE_REQUESTER}/${order.id}/${makerOrRequester.id}`;
    }
  }

  renderCommitmentInfo(order, commitment, index) {
    return (
      <li className="d-flex align-items-center" key={`commitment-info-${index}`}>
        <Link to={this.getContactLink(order, commitment.maker)}>
          <i className="fas fa-id-card mr-1"></i>
          {commitment.maker.name}
        </Link>
        <small className="align-self-center ml-2">({commitment.maker.postalCode} {commitment.maker.addressCity})</small>
        <span className="ml-auto">
          <span className="text-secondary">{commitment.quantity}</span>
          <span> / </span>
          <span className="text-primary">{order.quantity}</span>
        </span>
      </li>
    );
  }

  renderRequesterTable() {

    // [Image] [ThingTitle] [Name of Maker + City] [Quantity of Order] [Quantity of Maker Commitment] [Total Quantity of all Orders + Total Quantity of all Committments] [Contact]

    const { data } = this.state;
    const { t } = this.props;

    if (!data || !data.orders || data.orders.length === 0) {
      return (
        <div className="row">
          <div className="col">
            <Alert variant="info" className="mt-3 ml-3 mr-3">{t('nothing')}</Alert>
          </div>
        </div>
      );
    }

    return (
      <div className="Dashboard__table">
        <div className="row Dashboard__headline-row">
          <div className="col-md-4 Dashboard__headline">
            <h6>{t('product')}</h6>
          </div>
          <div className="col-md-5 Dashboard__headline">
            <h6>{t('maker')}</h6>
          </div>
          <div className="col-md-3 Dashboard__headline text-right">
            <h6>
              <span>{t('need-ins')}</span>
              <br />
              <small>
                <span className="text-primary">{t('needed-left')}</span>
                <span> / </span>
                <span className="text-secondary">{t('confirmation')}</span>
              </small>
            </h6>
          </div>
        </div>
        {data.orders.map((order, i) => {
          return (
            <div key={`order_${i}`} className='row Dashboard__value-row' data-cypress="dashboard-order-row">
              <div className="col-md-2">
                <div className='Dashboard__value Dashboard__value-img'>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <Link to={`/thing/${order.thing.id}`} className="align-self-center">
                    <img key={`things_image_${i}`} src={order.thing.imageUrl} />
                  </Link>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashboard__value'>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <Link to={`/thing/${order.thing.id}`} target='_blank'>
                    <p>{order.thing.name}</p>
                  </Link>
                </div>
              </div>
              <div className="col-md-8">
                <div className='Dashboard__value'>
                  {order.commitments.length > 0 &&
                  <ol>
                    {order.commitments.map((commitment, ii) => this.renderCommitmentInfo(order, commitment, ii))}
                  </ol>
                  }
                  {order.commitments.length === 0 &&
                  <p className="text-muted d-flex w-100">
                    {t('nomaker')}
                    <span className="ml-auto">
                      <span className="text-secondary">0</span>
                      <span> / </span>
                      <span className="text-primary">{order.quantity}</span>
                    </span>
                  </p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderMakerTable() {

    // [Image] [ThingTitle] [Name of Requester + City] [Quantity of Order] [Quantity of my Commitment] [Total Quantity of all Orders + Total Quantity of all Committments] [Contact]

    const { data } = this.state;
    const { t } = this.props;

    if (!data || !data.orders || data.orders.length === 0) {
      return (
        <div className="row">
          <div className="col">
            <Alert variant="info" className="mt-3 ml-3 mr-3">{t('nothingconfirmed')}</Alert>
          </div>
        </div>
      );
    }

    return (
      <div className="Dashboard__table">
        <div className="row Dashboard__headline-row">
          <div className="col-md-4 Dashboard__headline">
            <h6>{t('product')}</h6>
          </div>
          <div className="col-md-4 Dashboard__headline">
            <h6>
              <span>{t('institution')}</span>
              <br />
              <small>({t('city')})</small>
            </h6>
          </div>
          <div className="col-md-2 Dashboard__headline">
            <h6>
              {t('need')}
              <br />
              <small>
                <span className="text-secondary">{t('confirmed')}</span>
                <span> / </span>
                <span className="text-primary">{t('left')}</span>
              </small>
            </h6>
          </div>
          <div className="col-md-2 Dashboard__headline">
            <h6>{t('contact')}</h6>
          </div>
        </div>
        {data.orders.map((order, i) => {
          return (
            <div key={`order_${i}`} className='row Dashboard__value-row'>
              <div className="col-md-2">
                <div className='Dashboard__value Dashboard__value-img d-flex'>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <Link to={`/thing/${order.thing.id}`} className="align-self-center">
                    <img key={`things_image_${i}`} src={order.thing.imageUrl} />
                  </Link>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashboard__value'>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <Link to={`/thing/${order.thing.id}`} target='_blank'>
                    <p>{order.thing.name}</p>
                  </Link>
                </div>
              </div>
              <div className="col-md-4">
                <div className='Dashboard__value'>
                  <p>
                    <Link to={this.getContactLink(order, order.requester)}>{order.requester.name}</Link>
                    <br />
                    <small>({order.requester.addressCity})</small>
                  </p>
                </div>
              </div>
              <div className="col-md-2 text-center">
                <div className='Dashboard__value'>
                  {data.commitments && data.commitments.length > 0}
                  <span className="text-secondary" title={`Bestätigt am ${order.commitments[0].createdDate}`}>
                    {order.commitments[0].quantity}
                  </span>
                  <span> / </span>
                  <span className="text-primary" title={`Bestellt am ${order.createdDate}`}>
                    {order.quantity}
                  </span>
                </div>
              </div>
              <div className="col-md-2 text-center">
                <div className='Dashboard__value'>
                  <Link to={this.getContactLink(order, order.requester)}>
                    <i className="fas fa-id-card"></i>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { user } = this.context;
    const { t } = this.props;
    return (
      <div className="container Dashboard">
        <div className="row">
          <div className="col">
            {user.roles.includes(ROLE_REQUESTER) && <h1 data-cypress="dashboard-title">{t('title-requester')}</h1>}
            {user.roles.includes(ROLE_MAKER) && <h1 data-cypress="dashboard-title">{t('title-maker')}</h1>}
          </div>
        </div>
        <div className="row">
          <div className="col Dashboard__user">
            <h6>{user.email}</h6>
          </div>
        </div>
        {user.roles.indexOf('ROLE_REQUESTER') >= 0 ? this.renderRequesterTable() : this.renderMakerTable()}
      </div>
    );
  }
}

Dashboard.contextType = AppContext;

export default withTranslation('page-dashboard')(Dashboard);
