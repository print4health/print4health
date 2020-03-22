import React from 'react';
import PropTypes from 'prop-types';
import ThingListItem from './list-item';

class ThingList extends React.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      things: PropTypes.array,
    };
  }

  render() {
    if (this.props.things === undefined) {
      return (<div className="alert alert-danger">Error</div>);
    }

    return (
      <div className="thing-list row">
        {this.props.things.map((thing, idx) => (
          <div className="col-md-4" key={idx}>
            <ThingListItem thing={thing} />
          </div>
        ))}
      </div>
    );
  }
}

export default ThingList;
