import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import LoginModal from './../modal/login';
import { NavLink } from 'react-router-dom';
import AppContext from '../../context/app-context';
import {ROLE_MAKER, ROLE_REQUESTER} from '../../constants/UserRoles';

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
    const userRole = this.context.getCurrentUserRole();

    if (user && user.email) {
      return (
        <React.Fragment>
          {(userRole === ROLE_REQUESTER || userRole === ROLE_MAKER) &&
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="text-primary" to="/dashboard">Dashboard</NavLink>
          </li>
          }
          <li className="nav-item">
            <a href="#" className="nav-link" onClick={this.handleLogout}>Abmelden</a>
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
            Anmelden
          </a>
         </span>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="text-primary" exact to="/registration">Registrieren</NavLink>
        </li>
        {this.state.loginModal && <LoginModal onClose={() => this.setState({ loginModal: false })} />}
      </React.Fragment>
    );
  }
}

UserNav.contextType = AppContext;

export default UserNav;
