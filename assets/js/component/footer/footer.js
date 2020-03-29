import React from 'react';
import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, i18n } = this.props;
    return (
      <footer className="Footer bg-gray">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex mb-2 mb-md-0">
              <a
                className="nav-link text-center"
                href="https://wirvsvirushackathon.org"
                target="_blank"
                rel="noopener noreferrer"
                title="WirVsWirus Hackathon"
              >
                <img
                  src="https://wirvsvirushackathon.org/wp-content/uploads/2020/03/12-scaled.jpg"
                  alt="WirVsVirus Logo"
                />
              </a>
              <a
                className="nav-link text-center"
                href="https://devpost.com/software/print4health"
                target="_blank"
                rel="noopener noreferrer"
                title="Unser Beitrag bei DevPost"
              >
                <img
                  src="https://devpost-challengepost.netdna-ssl.com/assets/reimagine2/devpost-logo-646bdf6ac6663230947a952f8d354cad.svg"
                  alt="Devpost Logo"
                />
              </a>
            </div>
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <NavLink to="/contact" activeClassName="text-primary">{t('imprint')}</NavLink>
              </li>
              <li className="list-inline-item">
                <NavLink to="/imprint" activeClassName="text-primary">{t('imprint')}</NavLink>
              </li>
              <li className="list-inline-item">
                <NavLink to="/data-privacy-statement" activeClassName="text-primary">{t('privacy')}</NavLink>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://github.com/print4health/print4health"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Improve me on GitHub"
                >
                  {t('github')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}

export default withTranslation('footer')(Footer);
