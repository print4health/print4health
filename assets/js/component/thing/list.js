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
      <div className="thing-list card-columns">
        {this.props.things.map((thing, idx) => (
          <div className="thing-item-wrapper mb-2" key={idx}>
            <ThingListItem thing={thing} />
          </div>
        ))}
      </div>
    );
  }
}

export default ThingList;
