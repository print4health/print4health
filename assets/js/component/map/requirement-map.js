import React from 'react';
import AppContext from '../../context/app-context';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import axios from 'axios';
import { Config } from '../../config';
import PropTypes from 'prop-types';
import { divIcon } from 'leaflet/dist/leaflet-src.esm';
import { renderToStaticMarkup } from 'react-dom/server';

class RequirementMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
  }

  static get propTypes() {
    return {
      thing: PropTypes.object,
    };
  }

  componentDidMount() {
    const self = this;
    axios.get(Config.apiBasePath + '/orders/thing/' + this.props.thing.id)
      .then((res) => {
        if (!Array.isArray(res.data.orders)) {
          return;
        }
        self.setState({ orders: res.data.orders });
      })
      .catch((error) => {
        self.setState({
          error: error.response.data.error,
        });
      });
  }

  renderMarkers() {
    return <>
      {this.state.orders.map((order, id) => {
        const requester = order.requester;
        const iconMarkup = renderToStaticMarkup(
          <span className="fa-stack fa-2x">
          <i className="fa fa-circle fa-stack-2x text-white" />
          <i className="fas fa-plus-circle text-primary fa-stack-2x" />
          </span>,
        );
        const customMarkerIcon = divIcon({
          html: iconMarkup,
        });
        return <span key={id}>
          <Marker
            icon={customMarkerIcon}
            position={[requester.latitude, requester.longitude]}>
            <Popup>
              <p>
              <strong>{order.quantity} Stück benötigt von:</strong>
              </p>
              {requester.streetAddress}<br />
              {requester.postalCode} {requester.city}
            </Popup>
          </Marker>
        </span>;
      })}
    </>;
  }

  render() {
    const position = [51.1642292, 10.4541194];
    return <div id="map">
      <Map center={position} zoom={6}>
        <TileLayer url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
                   attribution="https://maps.wikimedia.org" />
        {this.renderMarkers()}
      </Map>
    </div>;
  }
}

RequirementMap.contextType = AppContext;

export default RequirementMap;
