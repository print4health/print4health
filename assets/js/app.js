import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Index from './container/index/index';
import Login from './container/login/login';
import UserNav from './component/user/user-nav';
import ThingList from './container/thing-list/thing-list'

export default function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Start</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/thing/list">Ersatzteile</Link>
              </li>
            </ul>

            <ul className="float-right navbar-nav mr-auto">
              <li className="nav-item">
                <UserNav/>
              </li>
            </ul>
          </div>
        </nav>
            <div className="container">
              <Switch>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/request-reset-password">
                  <Index />
                </Route>
                <Route path="/reset-password">
                  <Index />
                </Route>
                <Route path="/order/list">
                  <Index />
                </Route>
                <Route path="/order/map">
                  <Index />
                </Route>
                <Route path="/order/{id}">
                  <Index />
                </Route>
                <Route path="/thing/list">
                  <ThingList />
                </Route>
                <Route path="/thing/{id}">
                  <Index />
                </Route>
                <Route path="/thing/{id}/create-order">
                  <Index />
                </Route>
                <Route path="/faq">
                  <Index />
                </Route>
                <Route path="/about">
                  <Index />
                </Route>
                <Route path="/legal">
                  <Index />
                </Route>
                <Route path="/">
                  <Index />
                </Route>
              </Switch>
            </div>
      </div>
    </Router>
  );
}
