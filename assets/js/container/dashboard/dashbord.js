import React from 'react';
import AppContext from "../../context/app-context";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  async fetchData() {
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

  renderTale() {
    const { data } = this.state;

    if (!data || !data.orders) {
      return;
    }

    return(
      <div className="Dashbord__table">
        <div className="row Dashbord__headline-row">
          <div className="col-md-2 Dashbord__headline">
            <h6>Produkt Bild</h6>
          </div>
          <div className="col-md-2 Dashbord__headline">
            <h6>Produkt Name</h6>
          </div>
          <div className="col-md-2 Dashbord__headline">
            <h6>Priorität Bestellung</h6>
          </div>
          <div className="col-md-2 Dashbord__headline">
            <h6>Bedarf</h6>
          </div>
          <div className="col-md-2 Dashbord__headline">
            <h6>Herstellerbestätigung</h6>
          </div>
          <div className="col-md-2 Dashbord__headline">
            <h6>Bereits gedruckt</h6>
          </div>
        </div>
        {data.orders.map((order, i) => {
          return (
            <div key={`order_${i}`} className='row Dashbord__value-row'>
              <div className="col-md-2">
                <div className='Dashbord__value Dashbord__value-img'>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a href={order.thing.url} target='_blank'>
                    <img key={`things_image_${i}`} src={order.thing.imageUrl}/>
                  </a>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashbord__value'>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a href={order.thing.url} target='_blank'>
                    <p>{order.thing.name}</p>
                  </a>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashbord__value'>
                  {
                    // @TODO replace dummy value
                  }
                  <p>Normal</p>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashbord__value'>
                  <p>{order.thing.needed}</p>
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashbord__value'>
                  {order.quantity - order.remaining}
                </div>
              </div>
              <div className="col-md-2">
                <div className='Dashbord__value'>
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

    return (
      <div className="container Dashbord">
        <div className="row">
          <div className="col">
            <h1>Dashbord</h1>
          </div>
        </div>
        <div className="row">
          <div className="col Dashbord__user">
            <h6>{user.email}</h6>
          </div>
        </div>
        {this.renderTale()}
      </div>
    )
  }
}

Dashbord.contextType = AppContext;

export default Dashbord;
