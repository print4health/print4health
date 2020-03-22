import React from 'react';
import { Config } from '../../config';
import { Link } from 'react-router-dom';
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

  render() {
    const { loggedIn, email } = this.state;
    if (loggedIn === null) {
      return <span></span>;
    }
    if (loggedIn === true) {
      return <span>{email} <a href="/logout">logout</a></span>;
    }
    return (
      <span>
          <Link className="nav-link" to="/login">Login</Link>
       </span>
    );
  }
}

export default UserNav;
