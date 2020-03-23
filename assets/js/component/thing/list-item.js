import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class ThingListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: 'loading',
    };

    this.renderImage = this.renderImage.bind(this);
  }

  static get propTypes() {
    return {
      thing: PropTypes.object,
    };
  }

  componentDidMount() {
    const { thing } = this.props;
    const image = new Image();

    image.onload = () => {
      this.setState({ image: 'loaded' });
    };

    image.onerror = () => {
      this.setState({ image: 'error' });
    };

    image.src = thing.imageUrl;
  }

  renderImage() {
    const { thing } = this.props;
    const { image } = this.state;

    if (image === 'loading') {
      return (
        <div className="ThingListCard__image ThingListCard__image--loading">
          Bild wird geladen ...
        </div>
      );
    }

    if (image === 'error') {
      return (
        <div className="ThingListCard__image ThingListCard__image--fallback">
          Kein Bild vorhanden
        </div>
      );
    }

    return (
      <img
        src={thing.imageUrl}
        alt={thing.name}
        className="ThingListCard__image img-fluid card-img-top shadow-sm"
      />
    );
  }

  render() {
    const { thing } = this.props;

    if (thing === undefined) {
      return (<div className="alert alert-danger">Something went wrong</div>);
    }

    const todo = thing.needed - thing.printed;

    return (
      <Link to={`/thing/${thing.id}`} className="ThingListCard text-decoration-none card">
        <div className="card-block">
          {this.renderImage()}
          <div className="card-body">
            <h5 className="card-title text-truncate" title={thing.name}>{thing.name}</h5>
            <p className="ThingListCard__description card-text text-muted">{thing.description}</p>
          </div>
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col">
              <small className="text-uppercase text-muted d-block">Benötigt</small>
              <span>{thing.needed}</span>
            </div>
            <div className="col">
              <small className="text-uppercase text-muted d-block">Gedruckt</small>
              <span className={thing.printed > 0 ? 'text-success' : ''}>{thing.printed}</span>
            </div>
            <div className="col">
              <small className="text-uppercase text-muted d-block">Bedarf</small>
              <span className={todo > 0 ? 'text-danger' : ''}>{todo}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default ThingListItem;
