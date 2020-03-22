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
        <h2>
          {thing.name}
        </h2>
        <img src={thing.imageUrl} alt={thing.name} className="img-fluid" />
        <p>
          {thing.description}
        </p>
      </div>
    );
  }
}

export default ThingDetailContainer;
