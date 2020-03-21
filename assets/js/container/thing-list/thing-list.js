import React from 'react';
import { Config } from '../../config';
import ThingListItem from './../../component/thing/list-item.js';

class ThingList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      things: [],
    };
  }

  componentDidMount() {
    fetch(Config.apiBasePath + '/things.json')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            things: result.things,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        },
      );
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
        <h2>Verfügbare 3D-Modelle / Ersatzteile</h2>
        <p>
          Diese 3D Modelle wurden bisher von unserem Team ausgewählt und stehen für...
          Lorem Ipsum Dolor sid
        </p>
        <div className="container">
          <div className="row">
              {things.map((thing, idx) => (
              <div className="col-md-4">
                <ThingListItem key={idx} thing={thing} />
              </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ThingList;
