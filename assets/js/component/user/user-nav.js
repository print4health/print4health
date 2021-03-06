import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import LoginModal from './../modal/login';
import { NavLink } from 'react-router-dom';
import AppContext from '../../context/app-context';
import { withTranslation } from 'react-i18next';
import {ROLE_MAKER, ROLE_REQUESTER} from '../../constants/UserRoles';
import PropTypes from 'prop-types';

class UserNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  static get propTypes() {
    return {
      t: PropTypes.func
    };
  }

  componentDidMount() {
    const context = this.context;
    axios.get(Config.apiBasePath + '/user/profile')
      .then((res) => {
        context.setUser(res.data);
      })
      .catch(() => {
        context.setUser({});
      });
  }

  handleLogout(e) {
    e.preventDefault();
    const context = this.context;
    const { t } = this.props;
    axios.get(Config.apiBasePath + '/logout')
      .then(function () {
        context.setUser({});
        context.setAlert(t('main-nav.logout-ok'), 'success');
      });
  }

  render() {
    const { user } = this.context;
    const userRole = this.context.getCurrentUserRole();
    const { t } = this.props;

    if (user && user.email) {
      return (
        <React.Fragment>
          {(userRole === ROLE_MAKER) &&
          <li className="nav-item">
            <NavLink className="nav-link" data-cypress="navlink-dashboard" activeClassName="text-primary" to="/dashboard">{t('main-nav.dashboard-maker')}</NavLink>
          </li>
          }
          {(userRole === ROLE_REQUESTER) &&
          <li className="nav-item">
            <NavLink className="nav-link" data-cypress="navlink-dashboard" activeClassName="text-primary" to="/dashboard">{t('main-nav.dashboard-requester')}</NavLink>
          </li>
          }
          <li className="nav-item">
            <a href="#" className="nav-link" data-cypress="navlink-logout" onClick={this.handleLogout}>{t('main-nav.logout')}</a>
          </li>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <li className="nav-item">
        <span>
          <a href="#"
             className="nav-link"
             data-cypress="navlink-login"
             onClick={(e) => {
               e.preventDefault();
               this.setState({ loginModal: true });
             }}
          >
            {t('main-nav.login')}
          </a>
         </span>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" data-cypress="navlink-registration" activeClassName="text-primary" exact to="/registration">{t('main-nav.register')}</NavLink>
        </li>
        {this.state.loginModal && <LoginModal onClose={() => this.setState({ loginModal: false })} />}
      </React.Fragment>
    );
  }
}

UserNav.contextType = AppContext;

export default withTranslation('components')(UserNav);
