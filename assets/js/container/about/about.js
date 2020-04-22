import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class About extends React.Component {

  static get propTypes() {
    return {
      t: PropTypes.func
    };
  }

  render () {
    const { t } = this.props;
    return (
      <div className="container">
        <h2>{t('title')}</h2>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              {t('content')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation('page-about')(About);
