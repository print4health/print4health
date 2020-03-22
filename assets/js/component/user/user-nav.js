import React from 'react';
import { Config } from '../../config';
import { Link } from 'react-router-dom';

class UserNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      email: '',
    };
  }

  componentDidMount() {
    console.log('asd');
    fetch(Config.apiBasePath + '/user/profile')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            loggedIn: true,
            email: result.email,
          });
        },
        () => {
          this.setState({
            loggedIn: false,
            email: '',
          });
        },
      );
  }

  render() {
    const { loggedIn, email } = this.state;
    if (loggedIn) {
      return <span>hello {email}, <a href="/logout">logout</a></span>;
    }  else {
      return (
       <span>
          <Link className="nav-link" to="/login">Login</Link>
       </span>
      );
    }
  }
}

export default UserNav;
