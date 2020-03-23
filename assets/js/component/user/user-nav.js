import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';

class UserNav extends React.Component {

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const context = this.context;
    axios.get(Config.apiBasePath + '/logout')
      .then(function () {
        context.setUser({});
      });
  }

  render() {
    const context = this.context;
    if (context.user.email) {
      return <span>
        <a href="#" className="nav-link" onClick={this.handleLogout}>
          Logout {context.user.email}
        </a>
      </span>;
    }
    return (
      <span>
        <a href="#" className="nav-link" data-toggle="modal" data-target="#modal-login">
          Login
        </a>
       </span>
    );
  }
}

UserNav.contextType = AppContext;

export default UserNav;
