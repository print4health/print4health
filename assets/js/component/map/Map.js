import {Map as LeafLetMap, TileLayer} from "react-leaflet";
import React from "react";
import PropTypes from "prop-types";

const Map = ({position, zoom, markers}) => {
  // TODO add loading
  return(
    <div id="map">
      <LeafLetMap center={position} zoom={zoom}>
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution="&copy; openstreetmap.org"/>
        {markers}
      </LeafLetMap>
    </div>
  )
};

Map.propTypes = {
  position: PropTypes.array,
  zoom: PropTypes.number,
  markers: PropTypes.array
};

export default Map;
