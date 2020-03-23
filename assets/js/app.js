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
import RequestPasswordResetModal from './component/modal/request-password-reset';
import logo from '../logo-print4health-org.svg';
import Faq from './container/faq/faq';
import About from './container/about/about';
import AppContext from './context/app-context';
import ResetPassword from './container/reset-password/reset-password';
import DismissableAlert from './component/alert/dismissable-alert';
import Footer from './component/footer/footer';
import Imprint from './container/imprint/imprint';

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
  }

  setShowRequestPasswordResetModal(showRequestPasswordResetModal) {
    this.setState({ showRequestPasswordResetModal });
  }

  setShowOrderModal(showOrderModal) {
    this.setState({ showOrderModal });
  }

  setShowCommitModal(showCommitModal) {
    this.setState({ showCommitModal });
  }

  setCurrentThing(currentThing) {
    this.setState({ currentThing });
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
        }}
      >
        <Router>
          <Link to="/">
            <img src={logo} alt="Logo" className="rounded mx-auto d-block logo" />
          </Link>
          <nav className="navbar navbar-expand-lg navbar-light navbar-fixed-top">
            <div className="container font-weight-bold">
              <ul className="navbar-nav navbar-center">
                <li className="nav-item mx-5">
                  <Link className="nav-link" to="/">Start</Link>
                </li>
                <li className="nav-item mx-5">
                  <Link className="nav-link" to="/thing/list">Bedarf</Link>
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
            <DismissableAlert message={this.state.alertMessage} variant={this.state.alertClass} />
            <div className="row">
              <div className="col-sm"></div>
              <div className="col-xl-12">
                <Switch>
                  <Route path="/order/list" component={Index} />
                  <Route path="/order/map" component={Index} />
                  <Route path="/order/{id}" component={Index} />
                  <Route path="/thing/list" component={ThingListContainer} />
                  <Route path="/thing/:id" component={ThingDetailContainer} />
                  <Route path="/thing/:id/create-order" component={Index} />
                  <Route path="/faq" component={Faq} />
                  <Route path="/about" component={About} />
                  <Route path="/imprint" component={Imprint} />
                  <Route path="/reset-password/:passwordResetToken" component={ResetPassword} />
                  <Route path="/" component={Index} />
                </Switch>
              </div>
            </div>
          </div>
          <Footer />
          <LoginModal />
          <RequestPasswordResetModal />
        </Router>
      </AppContext.Provider>
    );
  }
}

export default App;
