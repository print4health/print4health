import React from 'react';
import { Config } from '../../config';
import ThingList from './../../component/thing/list.js';
import Search from './../../component/search/search';
import axios from 'axios';

class ThingListContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      things: [],
    };
  }

  componentDidMount() {

    axios.get(Config.apiBasePath + '/things')
      .then((res) => {
        this.setState({
          isLoaded: true,
          things: res.data.things,
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
    const { error, isLoaded, things } = this.state;
    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div className="row">
          <div className="col-xl-6 offset-xl-3">
            <Search />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2>Verfügbare 3D-Modelle / Ersatzteile</h2>
            <p>
              Diese 3D Modelle wurden bisher von unserem Team ausgewählt und stehen für...
              Lorem Ipsum Dolor sid
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ThingList things={things} />
          </div>
        </div>
      </div>
    );
  }
}

export default ThingListContainer;
