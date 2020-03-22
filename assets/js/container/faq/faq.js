import React from 'react';

class Faq extends React.Component {
  render () {
    return (
      <div className="container startpage">
        <h2>FAQ</h2>
        <span> Hier findet Ihr Antworten auf Eure Fragen.</span>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">FAQ Krankenhaus</h5>
                  <p className="card-text"></p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">FAQ Maker</h5>
                  <p className="card-text"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Faq;
