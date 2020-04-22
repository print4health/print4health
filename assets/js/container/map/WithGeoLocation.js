import React from 'react';
import PropTypes from "prop-types";

class WithGeoLocation extends React.Component {

    static get propTypes() {
        return {
            strategy: PropTypes.string,
            position: PropTypes.object,
            children: PropTypes.object,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
          strategy: props.strategy || "USERREQUEST",
          latitude: 51.1642292,
          longitude: 10.4541194
        };

        this.getCoords = this.getCoords.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
    }

    getStrategy() {
      return this.props.strategy || this.state.strategy;
    }

    updatePosition() {
      try {
        switch (this.getStrategy()) {
          case "INJECTED":
            this.injectedLocation();
            return;
          case "USERREQUEST":
            this.requestUserLocation();
            return;
          default:
            this.fallbackLocation();
        }
      } catch (e) {
        this.fallbackLocation();
      }
    }

    componentDidMount() {
      this.updatePosition();
    }

    componentDidUpdate(prevProps) {
        if(this.props.position !== prevProps.position ||
           this.props.strategy !== prevProps.strategy) {
          this.updatePosition();
        }
      }

    requestUserLocation() {
        navigator.geolocation.getCurrentPosition(({coords}) => {
          this.setState({
            latitude: coords.latitude,
            longitude: coords.longitude});
        });
    }

    injectedLocation() {
        const { latitude, longitude } = this.props.position;

        this.setState({
          latitude: latitude,
          longitude: longitude
        });
    }

    fallbackLocation() {
      this.setState({
        strategy: "DEFAULT",
        latitude: 51.1642292,
        longitude: 10.4541194});
    }

    getCoords() {
        return [
          this.state.latitude,
          this.state.longitude
        ]
    }

    render () {
      console.log(this.getCoords());
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, {...this.props, position: this.getCoords() })
        );

        return <div>{childrenWithProps}</div>
    }
}

export default WithGeoLocation;
