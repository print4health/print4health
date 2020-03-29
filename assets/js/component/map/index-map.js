import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import MarkerRequester from './marker-requester';
import MarkerRequesterHub from './marker-requester-hub';
import MarkerMaker from './marker-maker';

class IndexMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requester: [],
      maker: [],
    };
  }

  async fetchRequester() {
    if (this.state.requester.length > 0) {
      return;
    }
    try {
      const response = await fetch('/requester');

      if (response.status !== 200) {
        throw new Error();
      }
      const data = await response.json();
      this.setState({ requester: data.requester });
    } catch (e) {
      throw new Error();
    }
  }

  async fetchMaker() {
    if (this.state.maker.length > 0) {
      return;
    }
    try {
      const response = await fetch('/maker');

      if (response.status !== 200) {
        throw new Error();
      }
      const data = await response.json();
      this.setState({ maker: data.maker });
    } catch (e) {
      throw new Error();
    }
  }

  componentDidMount() {
    this.fetchMaker();
    this.fetchRequester();
  }

  renderRequesterMarkers() {
    return <>
      {this.state.requester.map((requester, id) => {
        if (!requester.latitude) {
          return null;
        }
        if (requester.isHub === true) {
          return <MarkerRequesterHub key={id} requester={requester} />;
        }
        return <MarkerRequester key={id} requester={requester} />;
      })}
    </>;
  }

  renderMakerMarkers() {
    return <>
      {this.state.maker.map((maker, id) => {
        if (!maker.latitude) {
          return null;
        }
        return <MarkerMaker key={id} maker={maker} />;
      })}
    </>;
  }

  render() {
    const position = [51.1642292, 10.4541194];
    return <div id="map">
      <Map center={position} zoom={6}>
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution="&copy; openstreetmap.org" />
        {this.renderRequesterMarkers()}
        {this.renderMakerMarkers()}
      </Map>
    </div>;
  }
}

export default IndexMap;
