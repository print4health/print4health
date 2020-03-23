import 'jquery';
import 'popper.js';
import 'bootstrap';
import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Index from './container/index/index';
import UserNav from './component/user/user-nav';
import ThingListContainer from './container/thing/list';
import ThingDetailContainer from './container/thing/detail';
import LoginModal from './component/modal/login';
import logo from '../logo-print4health-org.svg';
import Faq from './container/faq/faq';
import About from './container/about/about';
import AppContext from './context/app-context';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
    this.setUser = this.setUser.bind(this);
  }

  setUser(user) {
    this.setState({ user });
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          user: this.state.user,
          setUser: this.setUser,
        }}
      >
        <Router>
          <img src={logo} alt="Logo" className="rounded mx-auto d-block logo" />
          <nav className="navbar navbar-expand-lg navbar-light navbar-fixed-top">
            <div className="container font-weight-bold">
              <ul className="navbar-nav navbar-center">
                <li className="nav-item mx-5">
                  <Link className="nav-link" to="/">Start</Link>
                </li>
                <li className="nav-item mx-5">
                  <Link className="nav-link" to="/thing/list">Ersatzteile</Link>
                </li>
                <li className="nav-item mx-5">
                  <Link className="nav-link" to="/faq">FAQ</Link>
                </li>
                <li className="nav-item mx-5">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item mx-5">
                  <UserNav />
                </li>
              </ul>
            </div>
          </nav>

          <div className="container pt-3">
            <div className="row">
              <div className="col-sm"></div>
              <div className="col-xl-12">
                <Switch>
                  <Route path="/request-reset-password" component={Index} />
                  <Route path="/reset-password" component={Index} />
                  <Route path="/order/list" component={Index} />
                  <Route path="/order/map" component={Index} />
                  <Route path="/order/{id}" component={Index} />
                  <Route path="/thing/list" component={ThingListContainer} />
                  <Route path="/thing/:id" component={ThingDetailContainer} />
                  <Route path="/thing/:id/create-order" component={Index} />
                  <Route path="/faq" component={Faq} />
                  <Route path="/about" component={About} />
                  <Route path="/legal" component={Index} />
                  <Route path="/" component={Index} />
                </Switch>
              </div>
            </div>
            <LoginModal />
          </div>
          <div className="footer">
            <Link className="nav-link" to="/legal">Impressum</Link>
          </div>
        </Router>
      </AppContext.Provider>
    );
  }
}

export default App;
