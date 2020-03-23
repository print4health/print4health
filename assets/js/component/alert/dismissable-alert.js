import React from 'react';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import AppContext from '../../context/app-context';

class DismissableAlert extends React.Component {
  static get propTypes() {
    return {
      match: PropTypes.object,
      variant: PropTypes.string,
      message: PropTypes.string,
    };
  }

  render() {

    if (this.props.message === null) {
      return null;
    }

    return (
      <Alert variant={this.props.variant} onClose={() => this.context.setAlert(null, null)} dismissible>
        {this.props.message}
      </Alert>
    );
  }
}

DismissableAlert.contextType = AppContext;

export default DismissableAlert;
