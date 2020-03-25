import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from 'react-router-dom';
import ReactGA from 'react-ga';
import Index from './container/index/index';
import UserNav from './component/user/user-nav';
import ThingListContainer from './container/thing/list';
import ThingDetailContainer from './container/thing/detail';
import LoginModal from './component/modal/login';
import RequestPasswordResetModal from './component/modal/request-password-reset';
import logo from '../logo-print4health-org.svg';
import Faq from './container/faq/faq';
import AppContext from './context/app-context';
import ResetPassword from './container/reset-password/reset-password';
import DismissableAlert from './component/alert/dismissable-alert';
import Footer from './component/footer/footer';
import Imprint from './container/imprint/imprint';
import DataPrivacyStatement from './container/data-privacy-statement/data-privacy-statement';
import PageView from './component/page-view/page-view.js';
import { Config } from './config';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      alertMessage: null,
      alertClass: null,
      showLoginModal: false,
      showRequestPasswordResetModal: false,
      showOrderModal: false,
      showCommitModal: false,
      currentThing: null,
    };
    this.setUser = this.setUser.bind(this);
    this.getCurrentUserRole = this.getCurrentUserRole.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.setShowLoginModal = this.setShowLoginModal.bind(this);
    this.setShowRequestPasswordResetModal = this.setShowRequestPasswordResetModal.bind(this);
    this.setShowOrderModal = this.setShowOrderModal.bind(this);
    this.setShowCommitModal = this.setShowCommitModal.bind(this);
    this.setCurrentThing = this.setCurrentThing.bind(this);
    this.setPageTitle = this.setPageTitle.bind(this);
    ReactGA.initialize(Config.gaTrackingId, { standardImplementation: true });
  }

  setUser(user) {
    this.setState({ user });
  }

  getCurrentUserRole() {
    try {
      if (this.state.user.roles.includes('ROLE_REQUESTER')) {
        return 'ROLE_REQUESTER';
      } else if (this.state.user.roles.includes('ROLE_USER')) {
        return 'ROLE_USER';
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  setAlert(alertMessage, alertClass) {
    this.setState({ alertMessage, alertClass });
  }

  setShowLoginModal(showLoginModal) {
    this.setState({ showLoginModal });
    if (showLoginModal) {
      ReactGA.modalview('/login/show');
    }
  }

  setShowRequestPasswordResetModal(showRequestPasswordResetModal) {
    this.setState({ showRequestPasswordResetModal });
    if (showRequestPasswordResetModal) {
      ReactGA.modalview('/request-password-reset/show');
    }
  }

  setShowOrderModal(showOrderModal) {
    this.setState({ showOrderModal });
    if (showOrderModal) {
      ReactGA.modalview('/order/show');
    }
  }

  setShowCommitModal(showCommitModal) {
    this.setState({ showCommitModal });
    if (showCommitModal) {
      ReactGA.modalview('/commit/show');
    }
  }

  setCurrentThing(currentThing) {
    this.setState({ currentThing });
  }

  setPageTitle(title, prefix = 'print4health') {
    document.title = prefix + ' - ' + title;
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          user: this.state.user,
          setUser: this.setUser,
          getCurrentUserRole: this.getCurrentUserRole,
          setAlert: this.setAlert,
          showLoginModal: this.state.showLoginModal,
          setShowLoginModal: this.setShowLoginModal,
          showRequestPasswordResetModal: this.state.showRequestPasswordResetModal,
          setShowRequestPasswordResetModal: this.setShowRequestPasswordResetModal,
          showOrderModal: this.state.showOrderModal,
          setShowOrderModal: this.setShowOrderModal,
          showCommitModal: this.state.showCommitModal,
          setShowCommitModal: this.setShowCommitModal,
          currentThing: this.state.currentThing,
          setCurrentThing: this.setCurrentThing,
          setPageTitle: this.setPageTitle,
        }}
      >
        <Router>
          <header className="Header">
            <Link to="/">
              <img src={logo} alt="Logo" className="Header__logo" />
            </Link>
            <nav className="navbar navbar-light">
              <div className="container font-weight-bold text-uppercase">
                <ul className="mb-0 w-100 list-unstyled d-flex justify-content-around">
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="text-primary" exact to="/">Start</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="text-primary" to="/thing/list">Bedarf</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="text-primary" to="/faq">FAQ</NavLink>
                  </li>
                  <li className="nav-item">
                    <UserNav />
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          <main className="container py-5">
            <DismissableAlert message={this.state.alertMessage} variant={this.state.alertClass} />
            <Switch>
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
              <Route path="/" component={Index} />
            </Switch>
            <PageView />
          </main>
          <Footer />
          <LoginModal />
          <RequestPasswordResetModal />
        </Router>
      </AppContext.Provider>
    );
  }
}

export default App;
