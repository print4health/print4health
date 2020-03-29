import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import LoginModal from './../modal/login';
import { NavLink } from 'react-router-dom';
import AppContext from '../../context/app-context';
import { withTranslation } from 'react-i18next';

class UserNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
    };

    this.handleLogout = this.handleLogout.bind(this);
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
    axios.get(Config.apiBasePath + '/logout')
      .then(function () {
        context.setUser({});
        context.setAlert('erfolgreich abgemeldet.', 'success');
      });
  }

  render() {
    const { user } = this.context;
    const { t, i18n } = this.props;

    if (user && user.email) {
      return (
        <React.Fragment>
          {this.context.getCurrentUserRole() === 'ROLE_REQUESTER' &&
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="text-primary" to="/dashboard">{t('dashboard')}</NavLink>
          </li>
          }
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={this.handleLogout}>{t('logout')}</a>
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
             onClick={(e) => {
               e.preventDefault();
               this.setState({ loginModal: true });
             }}
          >
            {t('login')}
          </a>
         </span>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="text-primary" exact to="/register/maker">{t('register')}</NavLink>
        </li>
        {this.state.loginModal && <LoginModal onClose={() => this.setState({ loginModal: false })} />}
      </React.Fragment>
    );
  }
}

UserNav.contextType = AppContext;

export default withTranslation('user-nav')(UserNav);
