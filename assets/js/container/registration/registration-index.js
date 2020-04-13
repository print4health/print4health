import React from 'react';
import AppContext from '../../context/app-context';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class RegistrationIndex extends React.Component {

  constructor(props) {
    super(props);
  }

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
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h1 data-cypress="registration-index-title">{t('title')}</h1>
          <p className="mt-5">
            {t('text.part1')} <strong>{t('text.strong1')}
          </strong> {t('text.part2')} <i>(&quot;bestellen&quot;)</i> {t('text.part3')} <strong>
            {t('text.strong2')}</strong> {t('text.part4')}
          </p>

          <div className="row">
            <div className="col text-right">
              <Link className="btn btn-block btn-lg btn-outline-primary" to="/registration/requester"
                    data-cypress="registration-requester-link">
                {t('need')}
              </Link>
            </div>
            <div className="col text-right">
              <Link className="btn btn-block btn-lg btn-outline-primary" to="/registration/requester"
                    data-cypress="registration-hub-link">
                {t('hub')}
              </Link>
            </div>
            <div className="col">
              <Link className="btn btn-block btn-lg btn-outline-primary" to="/registration/maker"
                    data-cypress="registration-maker-link">
                {t('maker')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegistrationIndex.contextType = AppContext;

export default withTranslation('registrationindex')(RegistrationIndex);
