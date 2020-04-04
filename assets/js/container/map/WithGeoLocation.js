import React from 'react';
import PropTypes from "prop-types";

class WithGeoLocation extends React.Component {

    static get propTypes() {
        return {
            children: PropTypes.object,
        };
    }

    constructor(props){
        super(props);
        this.state = {
          strategy: "DEFAULT",
          latitude: 51.1642292,
          longitude: 10.4541194
        };

        this.getCoords = this.getCoords.bind(this);
    }

    getCoords() {
      return [
        this.state.latitude,
        this.state.longitude
      ]
    }
    render () {
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, {...this.props, position: this.getCoords() })
        );

        return <div>{childrenWithProps}</div>
    }
}

export default WithGeoLocation;
