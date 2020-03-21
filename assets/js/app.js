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
              <li className="nav-item">
                <Link className="nav-link" to="/users">Users</Link>
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
                  <Faq />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/legal">
                  <Legal />
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

function About() {
  return <h2>About</h2>;
}

function Faq() {
  return <h2>Faq</h2>;
}

function Legal() {
  return <h2>Legal</h2>;
}
