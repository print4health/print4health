import React from 'react';
import LoginModal from './../modal/login';
import { NavLink } from 'react-router-dom';
import AppContext from '../../context/app-context';
import { ROLE_MAKER, ROLE_REQUESTER } from '../../constants/UserRoles';
import { GET } from '../../security/Api';

class UserNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  async componentDidMount() {
    const context = this.context;

    const response = await GET('/user/profile');
    const data = await response.json();

    if (response.status === 200) {
      context.setUser(data);
    } else {
      context.setUser({});
    }
  }

  async handleLogout(e) {
    e.preventDefault();
    const context = this.context;

    await GET('/logout');

    context.setUser({});
    context.setAlert('erfolgreich abgemeldet.', 'success');
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
          <NavLink className="nav-link" activeClassName="text-primary" exact to="/register/maker">Registrieren</NavLink>
        </li>
        {this.state.loginModal && <LoginModal onClose={() => this.setState({ loginModal: false })} />}
      </React.Fragment>
    );
  }
}

UserNav.contextType = AppContext;

export default UserNav;
