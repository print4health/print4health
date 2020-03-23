import React from 'react';
import { HashRouter as Router, Link } from 'react-router-dom';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  renderFooter() {
    return (
      <footer className="container">
        <div className="row mt-5 mb-5">
          <div className="col d-flex d-flex justify-content-around">
            <a className="nav-link link-github" href="https://github.com/print4health/print4health" target="_blank" title="Improve me on GitHub">
              <i className="fab fa-github"></i>
              <span className="label mt-3">Improve me on GitHub</span>
            </a>
            <a className="nav-link link-wirvsvirus" href="https://wirvsvirushackathon.org" target="_blank" title="WirVsWirus Hackathon">
              <img src="https://wirvsvirushackathon.org/wp-content/uploads/2020/03/12-scaled.jpg" alt="WirVsVirus Logo" />
              <span className="label mt-3">WirVsVirus Hack</span>
            </a>
            <a className="nav-link link-devpost" href="https://devpost.com/software/print4health" target="_blank" title="Unser Beitrag bei DevPost">
              <img src="https://devpost-challengepost.netdna-ssl.com/assets/reimagine2/devpost-logo-646bdf6ac6663230947a952f8d354cad.svg" alt="Devpost Logo" />
              <span className="label mt-3">WirVsVirus Contribution</span>
            </a>
            <Link className="nav-link" to="/imprint">
              <i className="fas fa-id-card"></i>
              <span className="label mt-3">Impressum</span>
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  render() {
    return (
      <div className="container-fluid Footer mt-5">
        <div className="row">
          <div className="col">
            {this.renderFooter()}
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
