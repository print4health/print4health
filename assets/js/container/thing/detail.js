import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import PropTypes from 'prop-types';

class ThingDetailContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      thing: null,
    };
  }

  static get propTypes() {
    return {
      match: PropTypes.object,
      id: PropTypes.string,
    };
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

  render() {
    const { error, isLoaded, thing } = this.state;
    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
    }
    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-3">
            <h2>{thing.name}</h2>
            <div className="description">
              <p>{thing.description}</p>
            </div>
            <img src={thing.imageURL} alt={thing.name} />
          </div>
          <div className="col-md-6">
            deutschland karte
          </div>
          <div className="col-md-3">

          </div>
        </div>
      </div>
    );
  }
}

export default ThingDetailContainer;
