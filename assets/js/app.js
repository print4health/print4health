import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from 'react-router-dom';
import PrivateRoute from './component/security/PrivateRoute';
import ReactGA from 'react-ga';
import Index from './container/index/index';
import UserNav from './component/user/user-nav';
import ThingListContainer from './container/thing/list';
import ThingDetailContainer from './container/thing/detail';
import RequestPasswordResetModal from './component/modal/request-password-reset';
import logo from '../logo-print4health-org.svg';
import Dashboard from './container/dashboard/dashboard';
import Faq from './container/faq/faq';
import AppContext from './context/app-context';
import ResetPassword from './container/reset-password/reset-password';
import DismissableAlert from './component/alert/dismissable-alert';
import Footer from './component/footer/footer';
import Imprint from './container/imprint/imprint';
import DataPrivacyStatement from './container/data-privacy-statement/data-privacy-statement';
import PageView from './component/page-view/page-view.js';
import { Config } from './config';
import { Nav, Navbar } from 'react-bootstrap';
import RegisterMaker from './container/register-maker/register-maker';

const ROLE_USER = 'ROLE_USER';
const ROLE_MAKER = 'ROLE_MAKER';
const ROLE_REQUESTER = 'ROLE_REQUESTER';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      initalUserCheck: false,
      alertMessage: null,
      alertClass: null,
      showLoginModal: false,
      showRequestPasswordResetModal: false,
      order: null,
      currentThing: null,
    };
    this.setUser = this.setUser.bind(this);
    this.getCurrentUserRole = this.getCurrentUserRole.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.setShowRequestPasswordResetModal = this.setShowRequestPasswordResetModal.bind(this);
    this.setCurrentThing = this.setCurrentThing.bind(this);
    this.setPageTitle = this.setPageTitle.bind(this);
    ReactGA.initialize(Config.gaTrackingId, {});
  }

  setUser(user) {
    this.setState({
      user,
      initalUserCheck: true
    });
  }

  getCurrentUserRole() {
    const { user } = this.state;

    try {
      if (user.roles.includes(ROLE_MAKER)) {
        return ROLE_MAKER;
      }else if (user.roles.includes(ROLE_REQUESTER)) {
        return ROLE_REQUESTER;
      } else if (user.roles.includes(ROLE_USER)) {
        return ROLE_USER;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  setAlert(alertMessage, alertClass) {
    this.setState({ alertMessage, alertClass });
  }

  setShowRequestPasswordResetModal(showRequestPasswordResetModal) {
    this.setState({ showRequestPasswordResetModal });
    if (showRequestPasswordResetModal) {
      ReactGA.modalview('/request-password-reset/show');
    }
  }

  setCurrentThing(currentThing) {
    this.setState({ currentThing });
  }

  setPageTitle(title, prefix = 'print4health') {
    document.title = prefix + ' - ' + title;
  }

  render() {
    const { initalUserCheck, user, alertMessage, alertClass, showLoginModal, showRequestPasswordResetModal, currentThing, order } = this.state;

    return (
      <AppContext.Provider
        value={{
          user: user,
          setUser: this.setUser,
          getCurrentUserRole: this.getCurrentUserRole,
          setAlert: this.setAlert,
          showLoginModal: showLoginModal,
          showRequestPasswordResetModal: showRequestPasswordResetModal,
          setShowRequestPasswordResetModal: this.setShowRequestPasswordResetModal,
          order: order,
          currentThing: currentThing,
          setCurrentThing: this.setCurrentThing,
          setPageTitle: this.setPageTitle,
        }}
      >
        <Router>
          <header className="Header">
            <Link to="/">
              <img src={logo} alt="Logo" className="Header__logo" />
            </Link>
            <Navbar expand="lg">
              <div className="container font-weight-bold text-uppercase">

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mb-0 w-100 list-unstyled d-flex justify-content-around">
                    <li className="nav-item">
                      <NavLink className="nav-link" activeClassName="text-primary" exact to="/">Start</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" activeClassName="text-primary" to="/thing/list">Bedarf</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" activeClassName="text-primary" to="/faq">FAQ</NavLink>
                    </li>
                    <UserNav />
                  </Nav>
                </Navbar.Collapse>
              </div>
            </Navbar>
          </header>
          {initalUserCheck &&
            <main className="container py-5">
              <DismissableAlert message={alertMessage} variant={alertClass} />
              <Switch>
                <PrivateRoute path="/dashboard" component={Dashboard} authed={user && Object.keys(user).length !== 0 && this.getCurrentUserRole() === "ROLE_REQUESTER"} setAlert={this.setAlert} user={user}/>
                <Route path="/order/list" component={Index} />
                <Route path="/order/map" component={Index} />
                <Route path="/order/{id}" component={Index} />
                <Route path="/thing/list" component={ThingListContainer} />
                <Route path="/thing/:id" component={ThingDetailContainer} />
                <Route path="/thing/:id/create-order" component={Index} />
                <Route path="/faq" component={Faq} />
                <Route path="/imprint" component={Imprint} />
                <Route path="/data-privacy-statement" component={DataPrivacyStatement} />
                <Route path="/reset-password/:passwordResetToken" component={ResetPassword} />
                <Route path="/register/maker" component={RegisterMaker} />
                <Route path="/" component={Index} />
              </Switch>
              <PageView />
            </main>
          }
          <Footer />
          <RequestPasswordResetModal />
        </Router>
      </AppContext.Provider>
    );
  }
}

export default App;
