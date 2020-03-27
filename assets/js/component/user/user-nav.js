import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import LoginModal from './../modal/login';
import AppContext from '../../context/app-context';

class UserNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loginModal: false
    };

    this.handleLogout = this.handleLogout.bind(this);
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

    if (user && user.email) {
      return <span>
        <a href="#" className="nav-link" onClick={this.handleLogout}>
          Abmelden
        </a>
      </span>;
    }

    return (
      <React.Fragment>
        <span>
          <a href="#"
             className="nav-link"
             onClick={(e) => {
               e.preventDefault();
               this.setState({loginModal: true})
             }}
          >
            Anmelden
          </a>
         </span>
        {this.state.loginModal && <LoginModal onClose={() => this.setState({loginModal: false})}/>}
      </React.Fragment>
    );
  }
}

UserNav.contextType = AppContext;

export default UserNav;
