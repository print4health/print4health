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
import ThingListContainer from './container/thing/list'
import ThingDetailContainer from './container/thing/detail'

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
                <Route path="/login" component={Login}/>
                <Route path="/request-reset-password" component={Index}/>
                <Route path="/reset-password" component={Index}/>
                <Route path="/order/list" component={Index}/>
                <Route path="/order/map" component={Index}/>
                <Route path="/order/{id}" component={Index}/>
                <Route path="/thing/list" component={ThingListContainer}/>
                <Route path="/thing/:id" component={ThingDetailContainer}/>
                <Route path="/thing/:id/create-order" component={Index}/>
                <Route path="/faq" component={Index}/>
                <Route path="/about" component={Index}/>
                <Route path="/legal" component={Index}/>
                <Route path="/" component={Index}/>
              </Switch>
            </div>
      </div>
    </Router>
  );
}
