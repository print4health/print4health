import React from 'react';
import { Config } from '../../config';
import axios from 'axios';

class UserNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
      email: '',
    };
  }

  componentDidMount() {
    axios.get(Config.apiBasePath + '/user/profile')
      .then((res) => {
        this.setState({
          loggedIn: true,
          email: res.data.email,
        });
      })
      .catch(() => {
        this.setState({
          loggedIn: false,
          email: '',
        });
      });
  }

  handleLogout() {
    axios.get(Config.apiBasePath + '/logout')
      .then(function () {
        window.location.reload(true);
      });
  }

  render() {
    const { loggedIn, email } = this.state;
    if (loggedIn === null) {
      return <span></span>;
    }
    if (loggedIn === true) {
      return <span>
        <a href="#" className="nav-link" onClick={this.handleLogout}>
          logout {email}
        </a>
      </span>;
    }
    return (
      <span>
        <a href="#" className="nav-link" data-toggle="modal" data-target="#modal-login">
          login
        </a>
       </span>
    );
  }
}

export default UserNav;
