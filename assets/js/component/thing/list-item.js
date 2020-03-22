import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
          <Link to={'/thing/' + this.props.thing.id}>
            <img src={this.props.thing.imageUrl} alt={this.props.thing.name} className="img-fluid" />
          </Link>
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
