import React from 'react';
import Map from './Map';
import WithGeoLocation from '../../container/map/WithGeoLocation';
import WithMarkers from '../../container/map/WithMarkers';
import PropTypes from "prop-types";

const IndexMap = ({types = [], filters = [], position = {}}) => {
  let strategy;
  let zoom = 6;

  if('latitude' in position &&
     'longitude' in position) {
      strategy = "INJECTED";
      zoom = 10;
  }
  return (
    <div>
      <WithMarkers types={types} filters={filters}>
        <WithGeoLocation position={position} strategy={strategy} >
          {/*<Map zoom={zoom} style={true? {pointerEvents: 'none'} : {cursor: 'pointer'}}/>*/}
          <Map zoom={zoom} style={{pointerEvents: 'none'}}/>
        </WithGeoLocation>
      </WithMarkers>
    </div>
  )
};

IndexMap.propTypes = {
  types: PropTypes.array,
  disabled: PropTypes.bool,
  filters: PropTypes.array,
  position: PropTypes.object
};

export default IndexMap;
