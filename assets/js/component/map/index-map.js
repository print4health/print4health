import React from 'react';
import Map from './Map';
import WithGeoLocation from '../../container/map/WithGeoLocation';
import WithMarkers from '../../container/map/WithMarkers';
import PropTypes from "prop-types";

const IndexMap = ({types = [], filters = {}}) => {

  return (
    <WithMarkers types={types} filters={filters}>
      <WithGeoLocation>
        <Map zoom={6} />
      </WithGeoLocation>
    </WithMarkers>
  )
};

IndexMap.propTypes = {
  types: PropTypes.array,
  filters: PropTypes.object
};

export default IndexMap;
