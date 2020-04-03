import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet/dist/leaflet-src.esm';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

class MarkerRequester extends React.Component {

  static get propTypes() {
    return {
      requester: PropTypes.object,
    };
  }

  render() {
    const requester = this.props.requester;
    const iconMarkup = renderToStaticMarkup(
      <i className="fas fa-clinic-medical text-primary fa-2x" />,
    );
    const customMarkerIcon = divIcon({
      html: iconMarkup,
      popupAnchor: [10, 0],
    });
    return <Marker
      className="marker"
      icon={customMarkerIcon}
      position={[requester.latitude, requester.longitude]}
    >
      <Popup>
        <address>
          <h4>
            <i className="fas fa-clinic-medical text-primary fa-1x mr-1" />
            {requester.name}
          </h4>
          <p>
            {requester.streetAddress}<br />
            {requester.postalCode} {requester.addressCity}
          </p>
        </address>
      </Popup>
    </Marker>;
  }
}

export default MarkerRequester;
