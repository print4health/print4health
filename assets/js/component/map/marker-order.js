import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet/dist/leaflet-src.esm';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

class MarkerOrder extends React.Component {

  static get propTypes() {
    return {
      order: PropTypes.object,
    };
  }

  render() {
    const requester = this.props.order.requester;
    const iconMarkup = renderToStaticMarkup(
      <span className="fa-stack fa-2x">
          <i className="fa fa-circle fa-stack-2x text-white" />
          <i className="fas fa-plus-circle text-primary fa-stack-2x" />
          </span>,
    );
    const customMarkerIcon = divIcon({
      html: iconMarkup,
    });
    return <Marker
      icon={customMarkerIcon}
      position={[requester.latitude, requester.longitude]}>
      <Popup>
        <p>
          <strong>{this.props.order.quantity} Stück benötigt von:</strong>
        </p>
        {requester.streetAddress}<br />
        {requester.postalCode} {requester.city}
      </Popup>
    </Marker>;
  }
}

export default MarkerOrder;
