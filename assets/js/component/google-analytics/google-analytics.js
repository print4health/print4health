import React from 'react';
import { withRouter } from 'react-router-dom';
import { Config } from '../../config';
import AppContext from '../../context/app-context';

class GoogleAnalytics extends React.Component {

  componentDidUpdate({ location, history }) {
    this.context.sendGoogleAnalyticsTag();
  }

  render() {
    return null;
  }
}

GoogleAnalytics.contextType = AppContext;

export default withRouter(GoogleAnalytics);
