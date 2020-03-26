import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet/dist/leaflet-src.esm';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import AppContext from '../../context/app-context';

class MarkerOrder extends React.Component {

  static get propTypes() {
    return {
      order: PropTypes.object,
    };
  }

  renderCommitButton() {
    return <a href="#"
              onClick={(e) => {
                e.preventDefault();
                this.context.setShowCommitModal(true, this.props.order);
              }}
              className="text-secondary">
      Herstellung zusagen
      <i className="fas fa-plus-circle fa-fw text-secondary"></i>
    </a>;
  }

  renderCommitInfo() {
    return <span>info only</span>;
  }

  render() {
    const requester = this.props.order.requester;
    const iconMarkup = renderToStaticMarkup(
      <div className="map-marker-order">
        <i className="fas fa-map-marker-alt text-primary fa-3x" />
        <span className="text-primary border-primary rounded">{this.props.order.quantity}</span> /
        <span className="text-secondary border-secondary rounded">{this.props.order.printed}</span>
      </div>
      ,
    );
    const customMarkerIcon = divIcon({
      html: iconMarkup,
    });
    return <Marker
      icon={customMarkerIcon}
      position={[requester.latitude, requester.longitude]}>
      <Popup>
        <p>
          <strong>{requester.name}</strong><br />
          {requester.streetAddress}<br />
          {requester.postalCode} {requester.city}
        </p>
        <p>
          Bedarf: <strong className="text-primary">{this.props.order.quantity}</strong><br />
          Zugesagt: <strong className="text-secondary">{this.props.order.printed}</strong>
        </p>
        {this.context.getCurrentUserRole() === 'ROLE_MAKER' ? this.renderCommitButton() : this.renderCommitInfo()}
      </Popup>
    </Marker>;
  }
}

MarkerOrder.contextType = AppContext;

export default MarkerOrder;
