import React from 'react';
import AppContext from '../../context/app-context';
import { Map, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';
import MarkerOrder from './marker-order';

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
      orders: PropTypes.array,
      openModal: PropTypes.func
    };
  }

  componentDidMount() {
  }

  renderOrderMarkers() {
    return <>
      {this.props.orders.map((order, id) => {
        return <MarkerOrder key={id} order={order} openModal={this.props.openModal} />;
      })}
    </>;
  }

  render() {
    const position = [51.1642292, 10.4541194];
    return <div id="map">
      <Map center={position} zoom={6}>
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution="&copy; openstreetmap.org" />
        {this.renderOrderMarkers()}
      </Map>
    </div>;
  }
}

RequirementMap.contextType = AppContext;

export default RequirementMap;
