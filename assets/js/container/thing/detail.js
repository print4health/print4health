import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import PropTypes from 'prop-types';
import map from '../../../2000px-Karte_Deutschland.svg';
import AppContext from '../../context/app-context';
import OrderModal from '../../component/modal/order';
import CommitModal from '../../component/modal/commit';

class ThingDetailContainer extends React.Component {

  constructor(props) {
    super(props);
    this.toggleSpecs = this.toggleSpecs.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      thing: null,
      showSpecs: false,
    };
  }

  static get propTypes() {
    return {
      match: PropTypes.object,
      id: PropTypes.string,
    };
  }

  toggleSpecs(event) {
    event.preventDefault();
    this.setState(state => ({
      showSpecs: !state.showSpecs,
    }));
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    axios.get(Config.apiBasePath + '/things/' + id)
      .then((res) => {
        this.setState({
          isLoaded: true,
          thing: res.data.thing,
        });
      })
      .catch((error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      });
  }

  renderSpecification() {
    const { thing } = this.state;

    if (thing.specification.length > 0) {
      return (
        <div className="specs">{thing.specification}</div>
      );
    }
    if (thing.specification.length === 0) {
      return (
        <div className="specs">Noch keine Spezifikation enthalten.</div>
      );
    }
  }

  render() {
    const { error, isLoaded, thing, showSpecs } = this.state;
    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
    }
    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <div className="row ThingListDetail">
          <div className="col-md-3 thing-info">
            <h2>{thing.name}</h2>
            <img src={thing.imageUrl} alt={thing.name} />
            <div className="description mt-3">
              <p>{thing.description}</p>
            </div>
            <div className="media" onClick={this.toggleSpecs}>
              <div className="media-body">
                <strong className="text-uppercase">Spezifikationen:</strong>
              </div>
              <a className="btn btn-link">
                {showSpecs && <i className="fas fa-chevron-up fa-fw"></i>}
                {!showSpecs && <i className="fas fa-chevron-down fa-fw"></i>}
              </a>
            </div>
            {showSpecs && this.renderSpecification()}
          </div>
          <div className="col-md-6 col-map">
            <img src={map} className="map" />
          </div>
          <div className="col-md-3 col-order">
            <div className="media">
              <div className="media-body">
                <span className="mr-1">Bedarf gesamt:</span>
                <strong className="text-primary">{thing.needed}</strong>
              </div>
              <button
                className="btn btn-link"
                onClick={() => this.context.setShowOrderModal(true)}
                disabled={this.context.getCurrentUserRole() !== 'ROLE_REQUESTER'}
              >
                <i className="fas fa-plus-circle fa-fw text-primary"></i>
              </button>
            </div>
            <div className="media">
              <div className="media-body">
                <span className="mr-1">Prints gesamt:</span>
                <strong className="text-secondary">{thing.printed}</strong>
              </div>
              <button
                className="btn btn-link"
                onClick={() => this.context.setShowCommitModal(true)}
              >
                <i className="fas fa-plus-circle fa-fw text-secondary"></i>
              </button>
            </div>
            <a className="media" href={thing.url} target="_blank">
              <div className="media-body">
                <strong className="text-uppercase">Downloads</strong>
              </div>
              <span className="btn btn-link">
                <i className="fas fa-arrow-alt-circle-down fa-fw"></i>
              </span>
            </a>
          </div>
        </div>
        <OrderModal thingId={thing.id} />
        <CommitModal thingId={thing.id} />
      </div>

    );
  }
}

ThingDetailContainer.contextType = AppContext;

export default ThingDetailContainer;
