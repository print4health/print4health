import React from 'react';
import AppContext from '../../context/app-context';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import axios from 'axios';
import { Config } from '../../config';
import PropTypes from 'prop-types';
import 'leaflet-defaulticon-compatibility';

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
        return <span key={id}>
          <Marker
            position={[requester.latitude, requester.longitude]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
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
