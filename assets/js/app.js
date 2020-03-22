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
import Search from './component/search/search';
import Faq from './container/faq/faq';

export default function App() {
  return (
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
              <UserNav />
            </li>
          </ul>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm"></div>
          <div className="col-xl-6">
            <Search />
          </div>
          <div className="col-sm"></div>
        </div>
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
              <Route path="/about" component={Index} />
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
  );
}
