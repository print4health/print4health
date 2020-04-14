import React from 'react';
import { Config } from '../../config';
import ThingList from './../../component/thing/list.js';
import Search from './../../component/search/search';
import axios from 'axios';
import AppContext from '../../context/app-context';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class ThingListContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      things: [],
    };
    this.executeSearch = this.executeSearch.bind(this);
  }

  static get propTypes() {
    return {
      t: PropTypes.func
    };
  }

  componentDidMount() {
    const { t } = this.props;
    this.context.setPageTitle(t('list.pagetitle'));
    this.executeSearch('');
  }

  executeSearch(query) {
    query = query.trim();
    let url = Config.apiBasePath + '/things';
    if (query.length > 0) {
      url += '/search/' + query;
    }

    axios.get(url)
      .then((res) => {
        this.setState({
          isLoaded: true,
          things: res.data.things,
        });
      })
      .catch((error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      });
  }

  render() {
    const { error, isLoaded, things } = this.state;
    const { t } = this.props;

    if (error) {
      return <div className="alert alert-danger">{t('list.error')}: {error.message}</div>;
    } else if (!isLoaded) {
      return <div className="text-center py-5">{t('list.loading')} ...</div>;
    }

    return (
      <div>
        <Search executeSearch={this.executeSearch} />
        <ThingList things={things} />
      </div>
    );
  }
}

ThingListContainer.contextType = AppContext;

export default withTranslation('page-thing-list')(ThingListContainer);
