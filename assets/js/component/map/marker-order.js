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
      <i className="fas fa-map-marker-alt text-primary fa-2x" />,
    );
    const customMarkerIcon = divIcon({
      html: iconMarkup,
    });
    return <Marker
      icon={customMarkerIcon}
      position={[requester.latitude, requester.longitude]}>
      <Popup>
        <p>
          <strong>{this.props.order.quantity}</strong> Stück benötigt von:<br />
          <strong>{requester.name}</strong>
        </p>
        {requester.streetAddress}<br />
        {requester.postalCode} {requester.city}
      </Popup>
    </Marker>;
  }
}

export default MarkerOrder;
