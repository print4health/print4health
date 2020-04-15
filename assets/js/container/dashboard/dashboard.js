import React from 'react';
import AppContext from '../../context/app-context';
import { ROLE_MAKER, ROLE_REQUESTER } from '../../constants/UserRoles';
import { Link } from 'react-router-dom';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
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

  getContactLink(order) {
    const { user } = this.context;
    if (user.roles.includes(ROLE_REQUESTER)) {
      return `/contact/${ROLE_MAKER}/${order.id}`;
    }

    if (user.roles.includes(ROLE_MAKER)) {
      return `/contact/${ROLE_REQUESTER}/${order.id}`;
    }
  }

  renderMakerTable() {

    // [Image] [ThingTitle] [Name of Requester + City] [Quantity of Order] [Quantity of my Commitment] [Total Quantity of all Orders + Total Quantity of all Committments] [Contact]

    const { data } = this.state;

    if (!data || !data.orders) {
      return;
    }

    return (
      <div className="Dashboard__table">
        <div className="row Dashboard__headline-row">
          <div className="col-md-4 Dashboard__headline">
            <h6>Produkt</h6>
          </div>
          <div className="col-md-4 Dashboard__headline">
            <h6>
              <span>Einrichtung</span>
              <br />
              <small>(Stadt)</small>
            </h6>
          </div>
          <div className="col-md-2 Dashboard__headline">
            <h6>
              Bedarf
              <br />
              <small>
                <span className="text-secondary">bestätigt</span>
                <span> / </span>
                <span className="text-primary">benötigt</span>
              </small>
            </h6>
          </div>
          {/*}
          <div className="col-md-2 Dashboard__headline">
            <h6>
              <span>Bedarf (insg) </span>
              <br />
              <small>
                <span className="text-primary">Benötigt</span>
                <span> / </span>
                <span className="text-secondary">Bestätigungen</span>
              </small>
            </h6>
          </div>
          */}
          <div className="col-md-2 Dashboard__headline">
            <h6>Kontakt zur Einrichtung</h6>
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
                    <Link to={this.getContactLink(order)}>{order.requester.name}</Link>
                    <br />
                    <small>({order.requester.addressCity})</small>
                  </p>
                </div>
              </div>
              <div className="col-md-2 text-center">
                <div className='Dashboard__value'>
                  <span className="text-secondary" title={`Bestätigt am ${order.commitment.createdDate}`}>
                    {order.commitment.quantity}
                  </span>
                  <span> / </span>
                  <span className="text-primary" title={`Bestellt am ${order.createdDate}`}>
                    {order.quantity}
                  </span>
                </div>
              </div>
              {/*}
              <div className="col-md-2">
                <div className='Dashboard__value'>
                  <p>
                    <span className="text-primary">{order.thing.quantity}</span>
                    <span> / </span>
                    <span className="text-secondary">{order.thing.printed}</span>
                  </p>
                </div>
              </div>
              */}
              <div className="col-md-2 text-center">
                <div className='Dashboard__value'>
                  <Link to={this.getContactLink(order)}>
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

    return (
      <div className="container Dashboard">
        <div className="row">
          <div className="col">
            <h1>Dashboard</h1>
          </div>
        </div>
        <div className="row">
          <div className="col Dashboard__user">
            <h6>{user.email}</h6>
          </div>
        </div>
        {this.renderMakerTable()}
      </div>
    );
  }
}

Dashboard.contextType = AppContext;

export default Dashboard;
