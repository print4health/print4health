import React from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import AppContext from '../../context/app-context';

class PageView extends React.Component {

  componentDidUpdate({ location, history }) {
    if (location.pathname === this.props.location.pathname) {
      // don't log identical link clicks (nav links likely)
      return;
    }
    const path = history.location.pathname + history.location.search;
    const title = document.title;
    console.log(path, title);
    ReactGA.pageview(path, title);
  }

  render() {
    return null;
  }
}

PageView.contextType = AppContext;

export default withRouter(PageView);
