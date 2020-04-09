import React from 'react';
import AppContext from "../../context/app-context";
import { ROLE_MAKER, ROLE_REQUESTER } from '../../constants/UserRoles';
import PropTypes from "prop-types";
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
    };
  }

  async fetchData() {
    const { data } = this.state;
    const { role, orderId } = this.props.match.params;

    if (data !== null || !role || !orderId) {
      return;
    }

      const response = await fetch(`/orders/${orderId}`);

      if (response.status !== 200) {
        throw new Error();
      }

      const orderData = await response.json();

      if (role === ROLE_REQUESTER) {
        this.setState({ userRole: ROLE_REQUESTER });
        this.setState({ data: [orderData.requester] })
      }

      if (role === ROLE_MAKER) {
        this.setState({ userRole: ROLE_MAKER });
        const makersData = await Promise.all(
          orderData.makers.map(async makerId => {
            const maker = await this.fetchMaker(makerId);
            return maker;
          })
        );
        this.setState({ data: makersData })
      }

    }  catch () {
      throw new Error();
    }

  async fetchMaker(makerId) {
    try {
      const response = await fetch(`/maker/detail/${makerId}`);

      if (response.status !== 200) {
        throw new Error();
      }

      const makerData = await response.json();

      return makerData;
    }  catch (e) {
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
            (contact) => (
              this.renderCard(contact)
            ),
          )}
      </div>
    )
  }

  renderCard(data) {
    const { userRole } = this.state;
    const { t } = this.props;

    return (
      <div className="row Contact__card-row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{userRole === ROLE_REQUESTER ? (t('role.institute')+':') : userRole === ROLE_MAKER ? (t('role.maker')+':') : ''} {data.name}</h5>
              <h6 className="card-subtitle mb-2 text-muted"><a href={`mailto=${data.email}`} className="card-link">{data.email}</a></h6>
              <p className="card-text">{data.streetAddress}</p>
              <p className="card-text">{data.postalCode}</p>
              <p className="card-text">{data.addressCity}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Contact.contextType = AppContext;

export default withTranslation('contactboard')(Contact);
