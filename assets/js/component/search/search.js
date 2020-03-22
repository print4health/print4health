import React from 'react';

var searchPlaceholder = "Hier könnte eine Suchfunktion sein";

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  /*  if (this.props.thing === undefined) {
      return (<div className="alert alert-danger">Thing Error</div>);
    }*/
    return (
      <div className="input-group searchbar">
        <input type="text" className="form-control" placeholder={searchPlaceholder} aria-describedby="lupe"/>
        <div className="input-group-append">
          <button className="input-group-text" id="lupe">LUPE</button>
        </div>
      </div>
    );
  }
}

export default Search;
