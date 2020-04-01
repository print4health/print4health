import React from 'react';
import { withTranslation } from 'react-i18next';

class About extends React.Component {
  render () {
    const { t, i18n } = this.props;
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
export default withTranslation('about')(About);
