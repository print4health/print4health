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
      t: PropTypes.func
    };
  }

  componentDidMount() {
  }

  render() {
    const { t } = this.props;
    return (
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h1>{t('title')}</h1>
          <p className="mt-5">
            {t('text.part1')} <strong>{t('text.strong1')}
            </strong> {t('text.part2')} <i>(&quot;bestellen&quot;)</i> {t('text.part3')}
            <strong>{t('text.strong2')}</strong> {t('text.part4')}
          </p>

          <div className="row">
            <div className="col text-right">
              <Link className="btn btn-block btn-lg btn-outline-primary" to="/registration/requester">
                {t('need')}
              </Link>
            </div>
            <div className="col text-right">
              <Link className="btn btn-block btn-lg btn-outline-primary" to="/registration/requester">
                {t('hub')}
              </Link>
            </div>
            <div className="col">
              <Link className="btn btn-block btn-lg btn-outline-primary" to="/registration/maker">
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
