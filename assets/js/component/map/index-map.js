import React from 'react';
import Map from './Map';
import WithGeoLocation from '../../container/map/WithGeoLocation';
import WithMarkers from '../../container/map/WithMarkers';
import {MAKER, REQUESTER} from "../../constants/MapTypes";

class IndexMap extends React.Component {

  render() {
    return (
      <WithMarkers types={[REQUESTER, MAKER]}>
        <WithGeoLocation>
          <Map zoom={6} />
        </WithGeoLocation>
      </WithMarkers>);
  }
}

export default IndexMap;
