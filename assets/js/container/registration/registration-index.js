import React from 'react';
import AppContext from '../../context/app-context';
import { Link } from 'react-router-dom';

class RegistrationIndex extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1>Bei print4health registrieren</h1>
          <p>
            Hier könnt ihr euch auf unserer Plattform registrieren und danach entweder
            <strong>Bedarf an 3D gedruckten Gegenständen</strong> anmelden <i>("bestellen")</i> oder das
            <strong>Drucken von Gegenständen</strong> bestätigen.
          </p>

          <div className="row">
            <div className="col text-right">
              <Link className="btn btn-block btn-lg btn-outline-primary" to="/registration/requester">Ich habe Bedarf</Link>
            </div>
            <div className="col">
              <Link className="btn btn-block btn-lg btn-outline-primary" to="/registration/maker">Ich kann produzieren</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegistrationIndex.contextType = AppContext;

export default RegistrationIndex;
