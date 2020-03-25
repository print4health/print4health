import React from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import AppContext from '../../context/app-context';

class PageView extends React.Component {

  componentDidUpdate({ location, history }) {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    return null;
  }
}

PageView.contextType = AppContext;

export default withRouter(PageView);
