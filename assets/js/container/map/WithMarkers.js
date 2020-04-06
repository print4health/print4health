import React from 'react';
import PropTypes from "prop-types";
import Marker from "../../component/map/Marker";
import {
    HUB,
    MAKER,
    ORDERM,
    REQUESTER
} from "../../constants/MarkerTypes";

class WithMarkers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            markerLists: [],
        };

        this.fetchEntities = this.fetchEntities.bind(this);
        this.fetchEntity = this.fetchEntity.bind(this);
        this.renderMarkerTypes = this.renderMarkerTypes.bind(this);
        this.renderMarkers = this.renderMarkers.bind(this);
    }

    componentDidMount() {
        const { types } = this.props;
        this.fetchEntities(types);
    }

    componentDidUpdate(prevProps) {
      if(this.props.types !== prevProps.types) {
        let nextMarkerList = this.state.markerLists;
        nextMarkerList = nextMarkerList.filter(({type}) => {
          return this.props.types.includes(type);
        });

        this.setState({markerLists: nextMarkerList});
        this.fetchEntities(this.props.types);
      }
    }

  generateParams(){
      let suffix = "/";
      const { filters } = this.props;

      if(filters && filters.length) {
        if("key" in filters[0]) {
          suffix += filters[0].value + "/orders";
        }
      }

      return suffix;
    }

    generateUri(type) {
        switch (type) {
            case MAKER:
                return "/maker/geodata";
            case REQUESTER:
                return "/requester";
            // case HUB:
            //     return null;
            case ORDERM:
                return "/things";
            default:
                return "/404";
        }
    }

    fetchEntities(types) {
        if (typeof types !== "undefined" && types.length) {
            types.forEach((type) => {
                this.fetchEntity(type);
            });
        }
    }

    fetchEntity(type) {
        return new Promise((resolve) => {
            try {
                const uri = this.generateUri(type);
                const params = this.generateParams();
                if(uri && uri.length) {
                    fetch(uri + params).then((response) => {
                        response.json().then(data => {
                            if (response.status !== 200) {
                                throw new Error();
                            }

                            const nextState = this.state.markerLists;
                            const entities = Object.values(data)[0];
                            if(typeof entities !== "undefined" && entities.length) {
                                nextState.push({type: type, data: entities});
                                this.setState({markerLists: nextState});
                            }

                            resolve();
                        });
                    });
                }
            } catch (e) {
                throw new Error();
            }
        });
    }

    renderMarkerTypes(markerList) {
        return markerList.reduce((acc, {type, data})=> {
            return [...acc, ...this.renderMarkers({type, data})];
        }, []);
    }

    renderMarkers({type, data}) {
        return data
            .filter((marker) => (!!marker.latitude || (!!marker.requester && !!marker.requester.latitude)))
            .map((marker) => <Marker key={marker.id} type={type} data={marker} />);
    }

    render () {
        const { markerLists } = this.state;
        const markers = this.renderMarkerTypes(markerLists);

        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { markers: markers })
        );

        return <div>{childrenWithProps}</div>
    }
}

WithMarkers.propTypes = {
    children: PropTypes.object,
    markers: PropTypes.array,
    types: PropTypes.array,
    filters: PropTypes.array
};

export default WithMarkers;
