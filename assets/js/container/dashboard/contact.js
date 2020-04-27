import React from 'react';
import AppContext from '../../context/app-context';
import { ROLE_MAKER, ROLE_REQUESTER } from '../../constants/UserRoles';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      userRole: null,
    };
  }

  static get propTypes() {
    return {
      match: PropTypes.object,
    };
  }

  async fetchData() {
    const { data } = this.state;
    const { role, orderId, userId } = this.props.match.params;

    if (role !== ROLE_MAKER && role !== ROLE_REQUESTER) {
      return;
    }

    if (data !== null || !orderId || !userId) {
      return;
    }

    try {
      const response = await fetch(`/orders/${orderId}/user-details/${userId}`);

      if (response.status !== 200) {
        throw new Error();
      }

      const userDetails = await response.json();

      if (role === ROLE_REQUESTER) {
        this.setState({ userRole: ROLE_REQUESTER });
        this.setState({ data: [userDetails.requester] });
      } else if (role === ROLE_MAKER) {
        this.setState({ userRole: ROLE_MAKER });
        this.setState({ data: [userDetails.maker] });
      }

    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    this.fetchData();
  }

  render() {
    const { data } = this.state;

    if (!data) {
      return (<p>laden...</p>);
    }

    const { userRole } = this.state;

    return (
      <div className="container Dashboard">
        <div className="row">
          <div className="col">
            <h1>{userRole === ROLE_REQUESTER ? 'Einrichtung-' : userRole === ROLE_MAKER ? 'Maker-' : ''}Kontakt</h1>
            <Alert variant="info">
              <h6>Diese Kontakt Seite ist eine temporäre Lösung. Wir arbeiten aktuell mit hochdruck an an einem
                Nachrichten-Modul. Mit diesem habt Ihr hier bald die Möglichkeit direkt mit dem Maker/Anfragendem zu
                kommunizieren. Wir bitten um Verständniss das dies aktuell leider noch nicht möglich ist.</h6>
            </Alert>
          </div>
        </div>
        {data.map(
          (contact, idx) => (
            this.renderCard(contact, idx)
          ),
        )}
      </div>
    );
  }

  renderRequester(data) {
    return (
      <>
        <h5 className="card-title">Einrichtung {data.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          <a href={`mailto:${data.email}`} className="card-link">{data.email}</a>
        </h6>
        <p className="card-text">{data.streetAddress}</p>
        <p className="card-text">{data.postalCode}</p>
        <p className="card-text">{data.addressCity}</p>
        <Alert variant="info" className="mb-0">
          {data.contactInfo}
        </Alert>
      </>
    );
  }

  renderMaker(data) {
    return (
      <>
        <h5 className="card-title">Maker {data.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          <a href={`mailto:${data.email}`} className="card-link">{data.email}</a>
        </h6>
        <p className="card-text">{data.postalCode}</p>
        <p className="card-text">{data.addressCity}</p>
      </>
    );
  }

  renderCard(data, index) {
    const { userRole } = this.state;
    return (
      <div className="row Contact__card-row" key={`contact-card-${index}`}>
        <div className="col">
          <div className="card">
            <div className="card-body">
              {userRole === ROLE_REQUESTER && this.renderRequester(data)}
              {userRole === ROLE_MAKER && this.renderMaker(data)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Contact.contextType = AppContext;

export default Contact;
