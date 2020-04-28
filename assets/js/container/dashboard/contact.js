import React from 'react';
import AppContext from '../../context/app-context';
import { ROLE_MAKER, ROLE_REQUESTER } from '../../constants/UserRoles';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

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
      t: PropTypes.func
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
    const { t } = this.props;

    if (!data) {
      return (<p>{t('loading')}...</p>)
    }

    const { userRole } = this.state;

    return (
      <div className="container Dashboard">
        <div className="row">
          <div className="col">
            <h1>{userRole === ROLE_REQUESTER ? (t('role.institute')+'-') : userRole === ROLE_MAKER ? (t('role.maker')+'-') : ''}{t('title')}</h1>
            <Alert variant="info">
              <h6>{t('info')}</h6>
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
    const { t } = this.props;
    return (
      <>
        <h5 className="card-title">{t('role.institute')}: {data.name}</h5>
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
    const { t } = this.props;
    return (
      <>
        <h5 className="card-title">{t('role.maker')}: {data.name}</h5>
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

export default withTranslation('page-dashboard-contact')(Contact);
