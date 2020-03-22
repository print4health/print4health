import React from 'react';
import PropTypes from 'prop-types';

class ThingListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      thing: PropTypes.object,
    };
  }

  render() {
    if (this.props.thing === undefined) {
      return (<div className="alert alert-danger">Thing Error</div>);
    }
    return (
      <div className="card">
        <div className="card-block">
          <img src={this.props.thing.src} alt={this.props.thing.name} />
          <div className="card-body">
            <h5 className="cardTitle">{this.props.thing.name}</h5>
            <p className="card-text">
              {this.props.thing.description}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ThingListItem;
