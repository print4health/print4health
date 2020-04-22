import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  Col,
  Button
} from 'react-bootstrap';

const LocationField = ({submitCallback}) => {
  return(
    <Form id="location-field" onSubmit={(evt) => submitCallback(evt)}>
      <Form.Row>
        <Col md={{ span: 6, offset: 2 }}  sm={{ span: 9 }} xs={{ span: 9 }}>
          <Form.Control name="address" type="text" placeholder="Go to Address" />
        </Col>
        <Col md={{ span: 2 }} sm={{ span: 3 }} xs={{ span: 3 }}>
          <Button type="submit">Go</Button>
        </Col>
      </Form.Row>
    </Form>
  )
};

LocationField.propTypes = {
  submitCallback: PropTypes.func
};

export default LocationField;
