import React from 'react';
import { Alert } from 'react-bootstrap';

const Markdown = require('react-remarkable');
import AppContext from '../../context/app-context';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class Imprint extends React.Component {
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
            <Alert variant="info">
              <Markdown>{t('disclaimer')}</Markdown>
            </Alert>

            <h2>{t('headline1')}</h2>
            <p>
              print4health<br />
              Conrad Barthelmes<br />
              Goetheweg 2b<br />
              41469 Neuss
            </p>

            <h2>{t('contact.headline')}</h2>
            <Markdown>{t('contact.email')}</Markdown>
            <p>{t('contact.phone')}</p>

            <h3>{t('accountability_content.headline')}</h3>
            <p>{t('accountability_content.text1')}</p>
            <p>{t('accountability_content.text2')}</p>

            <h3>{t('accountability_links.headline')}</h3>
            <p>{t('accountability_links.text1')}</p>
            <p>{t('accountability_links.text2')}</p>

            <h3>{t('copyright.headline')}</h3>
            <p>{t('copyright.text1')}</p>
            <p>{t('copyright.text2')}</p>
          </div>
        </div>
      </div>
    );
  }
}

Imprint.contextType = AppContext;

export default withTranslation('page-imprint')(Imprint);
