import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

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
      t: PropTypes.func
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
    const { t } = this.props;

    if (image === 'loading') {
      return (
        <div className="ThingListCard__image ThingListCard__image--loading">
          {t('item.loading')}
        </div>
      );
    }

    if (image === 'error') {
      return (
        <div className="ThingListCard__image ThingListCard__image--fallback">
          {t('item.noimage')}
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
    const { t } = this.props;

    if (thing === undefined) {
      return (<div className="alert alert-danger">{t('item.fail')}/div>);
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
              <small className="text-uppercase text-muted d-block">{t('item.need')}</small>
              <span className={thing.needed > 0 ? 'text-primary' : ''}>{thing.needed}</span>
            </div>
            <div className="col">
              <small className="text-uppercase text-muted d-block">{t('item.made')}</small>
              <span className={thing.printed > 0 ? 'text-secondary' +
                '' : ''}>{thing.printed}</span>
            </div>
            <div className="col">
              <small className="text-uppercase text-muted d-block">{t('item.remaining')}</small>
              <span className={todo > 0 ? 'text-danger' : ''}>{todo}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default withTranslation('list')(ThingListItem);
