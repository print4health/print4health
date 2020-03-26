import React from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import AppContext from '../../context/app-context';
import PropTypes from 'prop-types';

class PageView extends React.Component {

  static get propTypes() {
    return {
      location: PropTypes.object,
      history: PropTypes.object
    };
  }

  componentDidUpdate({ location, history }) {
    if (location.pathname === this.props.location.pathname) {
      // don't log identical link clicks (nav links likely)
      return;
    }
    const path = history.location.pathname + history.location.search;
    const thingDetailMatch = path.match(/^\/thing\/[a-f0-9]{8}/);
    let title = document.title;

    if (thingDetailMatch !== null && thingDetailMatch.length > 0) {
      // title = 'print4health - Bedarf Detail';
      return;
    }
    ReactGA.pageview(path, title);
  }

  render() {
    return null;
  }
}

PageView.contextType = AppContext;

export default withRouter(PageView);
