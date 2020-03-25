import React from 'react';
import { withRouter } from 'react-router-dom';
import { Config } from '../../config';

class GoogleAnalytics extends React.Component {

  componentDidUpdate({ location, history }) {
    const gtag = window.gtag;

    if (location.pathname === this.props.location.pathname) {
      // don't log identical link clicks (nav links likely)
      return;
    }


    if (history.action === 'PUSH' &&
      typeof (gtag) === 'function') {
      const data = {
        'page_title': document.title,
        'page_location': window.location.href,
        'page_path': location.pathname,
      };
      gtag('config', Config.gaTrackingId, data);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(GoogleAnalytics);
