import React from 'react';
import AppContext from "../../context/app-context";
import {ROLE_MAKER, ROLE_REQUESTER} from '../../constants/UserRoles';
import { withTranslation } from 'react-i18next';

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
    const { user } = this.context;
    const { data } = this.state;

    if (data !== null) {
      return;
    }

    try {
      const response = await fetch(`/orders/maker/${user.id}`);

      if (response.status !== 200) {
        throw new Error();
      }

      const data = await response.json();

      this.setState({ data })
    }  catch (e) {
      throw new Error();
    }
  }

  async fetchDataByRequester() {
    const { user } = this.context;
    const { data } = this.state;

    if (data !== null) {
      return;
    }

    try {
      const response = await fetch(`/orders/requester/${user.id}`);

      if (response.status !== 200) {
        throw new Error();
      }

      const data = await response.json();

      this.setState({ data })
    }  catch (e) {
      throw new Error();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    this.fetchData();
  }

  renderTable() {
    const { data } = this.state;
    const { t, i18n } = this.props;

    if (!data || !data.orders) {
      return;
    }

    return(
      <div className="Dashboard__table">
        <div className="row Dashboard__headline-row">
          <div className="col-md-2 Dashboard__headline">
            <h6>{t('picture')}</h6>
          </div>
          <div className="col-md-2 Dashboard__headline">
            <h6>{t('name')}</h6>
          </div>
          <div className="col-md-2 Dashboard__headline">
            <h6>{t('orderprio')}</h6>
          </div>
          <div className="col-md-2 Dashboard__headline">
            <h6>{t('need')}</h6>
          </div>
          <div className="col-md-2 Dashboard__headline">
            <h6>{t('confirmation')}</h6>
          </div>
          <div className="col-md-2 Dashboard__headline">
            <h6>{t('printed')}</h6>
          </div>
        </div>
        {data.orders.map((order, i) => {
          return (
            <div key={`order_${i}`} className='row Dashboard__value-row'>
              <div className="col-md-2">
                <div className='Dashboard__value Dashboard__value-img'>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a href={order.thing.url} target='_blank'>
                    <img key={`things_image_${i}`} src={order.thing.imageUrl}/>
                  </a>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashboard__value'>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a href={order.thing.url} target='_blank'>
                    <p>{order.thing.name}</p>
                  </a>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashboard__value'>
                  {
                    // @TODO replace dummy value
                  }
                  <p>Normal</p>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashboard__value'>
                  <p>{order.thing.needed}</p>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashboard__value'>
                  {order.quantity - order.remaining}
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashboard__value'>
                  <p>{order.thing.printed}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  render() {
    const { user } = this.context;
    const { t, i18n } = this.props;
    return (
      <div className="container Dashboard">
        <div className="row">
          <div className="col">
            <h1>{t('title')}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col Dashboard__user">
            <h6>{user.email}</h6>
          </div>
        </div>
        {this.renderTable()}
      </div>
    )
  }
}

Dashboard.contextType = AppContext;

export default withTranslation('dashboard')(Dashboard);
