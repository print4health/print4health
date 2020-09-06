import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Markdown from 'react-remarkable';
import AppContext from '../../context/app-context';

class DataPrivacyStatement extends React.Component {
  static get propTypes() {
    return {
      t: PropTypes.func,
    };
  }

  componentDidMount() {
    const { t } = this.props;
    this.context.setPageTitle(t('pagetitle'));
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container imprint">
        <div className="row">
          <div className="col">
            <h1>{t('title')}</h1>
            <h2>{t('headline1')}</h2>
            <h3>{t('headline2')}</h3>
            <Markdown>{t('content')}</Markdown>
          </div>
        </div>
      </div>
    );
  }
}

DataPrivacyStatement.contextType = AppContext;

export default withTranslation('page-privacy')(DataPrivacyStatement);
