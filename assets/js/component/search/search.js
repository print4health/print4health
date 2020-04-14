import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { withTranslation } from 'react-i18next';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.executeSearchDebounced = debounce(this.executeSearchDebounced, 400);
  }

  static get propTypes() {
    return {
      executeSearch: PropTypes.func,
      t: PropTypes.func
    };
  }

  handleInputChange(e) {
    this.executeSearchDebounced(e.target.value);
  }

  executeSearchDebounced(value) {
    this.props.executeSearch(value);
  }

  render() {
    const { t } = this.props;
    return (
      <div className="Search input-group">
        <input
          type="text"
          className="form-control"
          placeholder={t('searchbar')}
          aria-describedby="lupe"
          onChange={this.handleInputChange}
        />
        <div className="input-group-append">
          <button className="input-group-text" id="lupe">
            <i className="fas fa-search" />
          </button>
        </div>
      </div>
    );
  }
}

export default withTranslation('component-searchbar')(Search);
