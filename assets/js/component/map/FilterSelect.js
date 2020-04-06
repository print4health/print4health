import React from "react";
import PropTypes from "prop-types";
import {
  Form
} from 'react-bootstrap';
import {MAKER, REQUESTER, ORDERM} from "../../constants/MapTypes";

const FilterSelect = ({changeCallback, mapTypesStatus}) => {
  const types = [MAKER, REQUESTER, ORDERM];

  return(
    <Form>
      {types.map((type, idx) => (
        <div key={idx} className="mb-3">
          <Form.Check
            type={'checkbox'}
            defaultChecked={mapTypesStatus[type]}
            onChange={() => changeCallback(type)}
            id={idx + type + `-checkbox`}
            label={type}
          />
        </div>
      ))}
    </Form>
  )
};

FilterSelect.propTypes = {
  changeCallback: PropTypes.func,
  mapTypesStatus: PropTypes.object,
};

export default FilterSelect;
