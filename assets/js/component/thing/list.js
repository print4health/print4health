import React from 'react';
import PropTypes from 'prop-types';
import ThingListItem from './list-item';
import { withTranslation } from 'react-i18next';

class ThingList extends React.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      things: PropTypes.array,
      t: PropTypes.func
    };
  }

  render() {
    const { t } = this.props;
    if (this.props.things === undefined) {
      return (<div className="alert alert-danger">{t('list.error')}</div>);
    }

    if (this.props.things.length === 0) {
      return (<div className="alert alert-warning">{t('list.nothing')}</div>);
    }

    return (
      <div className="row">
        {this.props.things.map((thing) => (
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4" key={thing.id}>
            <ThingListItem thing={thing} />
          </div>
        ))}
      </div>
    );
  }
}

export default withTranslation('list')(ThingList);
