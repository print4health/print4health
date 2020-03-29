import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet/dist/leaflet-src.esm';
import { Marker, Polygon, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

class MarkerRequesterHub extends React.Component {

  static get propTypes() {
    return {
      requester: PropTypes.object,
    };
  }

  render() {
    const requester = this.props.requester;
    console.log(requester.area);
    const iconMarkup = renderToStaticMarkup(
      <i className="fab fa-hubspot text-success fa-4x" />,
    );
    const customMarkerIcon = divIcon({
      html: iconMarkup,
      popupAnchor: [10, 0],
    });
    return <React.Fragment>
      <Marker
        icon={customMarkerIcon}
        position={[requester.latitude, requester.longitude]}
      >
        <Popup>
          <address>
            <h4>{requester.name}</h4>
            <p>
              {requester.streetAddress}<br />
              {requester.postalCode} {requester.city}
            </p>
          </address>
        </Popup>
      </Marker>
      <Polygon positions={requester.area} />
    </React.Fragment>;
  }
}

export default MarkerRequesterHub;
