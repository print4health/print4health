import React from "react";
import PropTypes from "prop-types";

import {
  MAKER,
  REQUESTER,
  ORDERM,
  HUB,
} from "../../constants/MarkerTypes";

import MarkerMaker from "../../component/map/marker-maker";
import MarkerRequesterHub from "../../component/map/marker-requester-hub";
import MarkerRequester from "../../component/map/marker-requester";
import MarkerOrder from "../../component/map/marker-order";

const Marker = ({id, type, data}) => {
  switch (type) {
    case MAKER:
      return <MarkerMaker key={id} maker={data} />;
    case REQUESTER:
      return <MarkerRequester key={id} requester={data} />;
    case HUB:
      return <MarkerRequesterHub key={id} requester={data} />;
    case ORDERM:
      return <MarkerOrder key={id} order={data} />;
  }
};

Marker.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.object
};

export default Marker;
