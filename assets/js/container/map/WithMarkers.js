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

    constructor(props){
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

    generateUri(type) {
        // TODO add filters
        switch (type) {
            case MAKER:
                return "/maker/geodata";
            case REQUESTER:
                return "/requester";
            case HUB:
                return null;
            case ORDERM:
                return null;
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
                if(uri && uri.length) {
                    fetch(uri).then((response) => {
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
            .filter((marker) => (!!marker.id && !!marker.latitude))
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
    types: PropTypes.array
};

export default WithMarkers;
