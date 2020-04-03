import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet/dist/leaflet-src.esm';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

class MarkerMaker extends React.Component {

  static get propTypes() {
    return {
      maker: PropTypes.object,
    };
  }

  render() {
    const maker = this.props.maker;
    const iconMarkup = renderToStaticMarkup(
      <i className="fas fa-tools text-secondary fa-2x" />,
    );
    const customMarkerIcon = divIcon({
      html: iconMarkup,
      popupAnchor: [10, 0],
    });
    return <Marker
      className="marker"
      icon={customMarkerIcon}
      position={[maker.latitude, maker.longitude]}
    >
      <Popup>
        <address>
          <i className="fas fa-tools text-secondary fa-1x mr-1" />
          Maker in {maker.postalCode}, {maker.addressCity}
        </address>
      </Popup>
    </Marker>;
  }
}

export default MarkerMaker;
