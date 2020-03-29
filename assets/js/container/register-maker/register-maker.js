import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';

function RegistrationForm() {

  const { register, errors, handleSubmit } = useForm();
  const onSubmit = data => {
    console.log(data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1>Maker Registrierung</h1>
          <p>
            Hier könnt ihr euch als Maker bei <span className="text-primary">print4health.org</span> registrieren.
            Bitte füllt das Formular gewissenhaft aus, denn schließlich geht es darum, Menschen zu helfen.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 registration-form">
            <Form.Group as={Row} controlId="registerMakerName">
              <Form.Label column sm="2">Name*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="name"
                              placeholder="Dein Name"
                              ref={register({ required: 'Pflichtfeld', minLength: 5, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  Bitte trage deinen Namen ein. Er wird nicht öffentlich angezeigt und ist notwendig zur Vermittlung
                  zwischen den Institutionen, die Bedarf angemeldet haben. Mindestens fünf Zeichen sind erforderlich.
                  {errors.name &&
                  <Form.Control.Feedback type="invalid">
                    test
                  </Form.Control.Feedback>
                  }
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerEmail">
              <Form.Label column sm="2">E-Mail*</Form.Label>
              <Col sm="10">
                <Form.Control type="email"
                              name="email"
                              placeholder="Deine E-Mail Adresse"
                              ref={register({
                                required: true,
                                maxLength: 255,
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                  message: 'Ungültige E-Mail Adresse',
                                },
                              })} />
                <Form.Text className="text-muted">
                  Bitte trage deine E-Mail Adresse ein. Sie wird verwendet um dein Passwort zurück zu setzen oder
                  damit Institutionen Kontakt mit dir aufnehmen können.
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPasswort">
              <Form.Label column sm="2">Passwort*</Form.Label>
              <Col sm="10">
                <Form.Control type="password"
                              name="password"
                              placeholder="Dein Passwort"
                              ref={register({ required: true, minLength: 8, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  Dein Passwort für print4health.org. Am besten du wählst ein langes mit vielen Sonderzeichen und es
                  steht nirgendwo im Wörterbuch.
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPostalCode">
              <Form.Label column sm="2">Postleitzahl*</Form.Label>
              <Col sm="10">
                <Form.Control type="number"
                              name="postalCode"
                              placeholder="Postleitzahl"
                              ref={register({ required: true, minLength: 4, maxLength: 5 })} />
                <Form.Text className="text-muted">
                  Deine Postleitzahl wird verwendet um dich bei einer nächsten Version auf einer Karte anzuzeigen, damit
                  eine Einrichtung in deiner Nähe sehen kann, dass du zur Verfügung stehst.
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPostalState">
              <Form.Label column sm="2">Land</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="addressState"
                              placeholder="Land"
                              ref={register({ required: false, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  Das Land in dem du Wohnst (kein Pflichtfeld)
                </Form.Text>
              </Col>
            </Form.Group>
            <Row>
              <Col sm={{ offset: 2 }}>
                <h3>Einverständniserklärungen</h3>
                <Form.Group className="d-flex" controlId="registerMakerConfirmedRuleForFree">
                  <Form.Check
                    type="checkbox"
                    id="registerMakerConfirmedRuleForFree"
                    name="registerMakerConfirmedRuleForFree"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Ich erkläre mich im Umfang meiner Möglichkeiten bereit, nach besten Möglichkeiten und
                      Fähigkeiten kostenlos 3D-Drucke für Krankenhäuser und sonstige medizinische und soziale
                      Einrichtungen sowie medizinisches Personal herzustellen, die auf dieser Internetpräsenz
                      registriert sind.
                    </Form.Label>
                    {errors.registerMakerConfirmedRuleForFree &&
                    <Form.Control.Feedback type="invalid">
                      Bitte akzeptiere alle unsere Bedingungen für die Plattform.
                    </Form.Control.Feedback>
                    }
                  </Form.Text>
                  <div className="clearfix"></div>
                </Form.Group>
                <Form.Group className="d-flex" controlId="confirmedRuleMaterialAndTransport">
                  <Form.Check
                    type="checkbox"
                    id="confirmedRuleMaterialAndTransport"
                    name="confirmedRuleMaterialAndTransport"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Regelungen zu etwaigen Materialkostenübernahmen sowie für etwaig anfallende Transportkosten werde
                      ich mit den vermittelten Krankenhäusern und sonstigen medizinischen und sozialen Einrichtungen
                      sowie medizinischem Personal unmittelbar treffen.
                    </Form.Label>
                    {errors.confirmedRuleMaterialAndTransport &&
                    <Form.Control.Feedback type="invalid">
                      Bitte akzeptiere alle unsere Bedingungen für die Plattform.
                    </Form.Control.Feedback>
                    }
                  </Form.Text>
                </Form.Group>
                <Form.Group className="d-flex" controlId="confirmedPlattformIsContactOnly">
                  <Form.Check
                    type="checkbox"
                    id="confirmedPlattformIsContactOnly"
                    name="confirmedPlattformIsContactOnly"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Mir ist bekannt, dass print4health ausschließlich Kontakte zwischen Krankenhäusern und sonstigen
                      medizinischen und sozialen Einrichtungen sowie medizinischem Personal einerseits und privaten
                      3D-Druckern und Designern von 3D-Druck-Bauplänen andererseits vermittelt.
                    </Form.Label>
                    {errors.confirmedPlattformIsContactOnly &&
                    <Form.Control.Feedback type="invalid">
                      Bitte akzeptiere alle unsere Bedingungen für die Plattform.
                    </Form.Control.Feedback>
                    }
                  </Form.Text>
                </Form.Group>
                <Form.Group className="d-flex" controlId="confirmedNoAccountability">
                  <Form.Check
                    type="checkbox"
                    id="confirmedNoAccountability"
                    name="confirmedNoAccountability"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Ich erkläre mich daher damit einverstanden, dass print4health keinerlei Haftung für
                      <ul className="mb-2 mt-2">
                        <li>das Zustandekommen von 3D-Druck-Aufträgen und</li>
                        <li>die Qualität der auf dieser Internetpräsenz vorgehaltenen 3D-Druck-Design-Vorlagen</li>
                      </ul>
                      übernimmt.
                    </Form.Label>
                    {errors.confirmedNoAccountability &&
                    <Form.Control.Feedback type="invalid">
                      Bitte akzeptiere alle unsere Bedingungen für die Plattform.
                    </Form.Control.Feedback>
                    }
                  </Form.Text>
                </Form.Group>
                <Form.Group className="d-flex" controlId="confirmedPersonalDataTransferToRequester">
                  <Form.Check
                    className="mr-2"
                    type="checkbox"
                    id="confirmedPersonalDataTransferToRequester"
                    name="confirmedPersonalDataTransferToRequester"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Einer Weitergabe der von mir mitgeteilten Kontaktdaten und Kapazitätsangaben durch print4health an
                      registrierte Krankenhäuser und sonstige medizinische und soziale Einrichtungen sowie medizinisches
                      Personal stimme ich ausdrücklich zu.
                    </Form.Label>
                    {errors.confirmedPersonalDataTransferToRequester &&
                    <Form.Control.Feedback type="invalid">
                      Bitte akzeptiere alle unsere Bedingungen für die Plattform.
                    </Form.Control.Feedback>
                    }
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Als Maker Registrieren
                </Button>
              </Col>
            </Row>
            {/*
                {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}
                <div className="form-group">
                  <input name="password"
                         type="password"
                         placeholder="Passwort"
                         className="form-control"
                         required
                         value={this.state.password}
                         onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <input name="repeatPassword"
                         type="password"
                         placeholder="Passwort wiederholen"
                         className="form-control"
                         required
                         value={this.state.repeatPassword}
                         onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <input type="submit" className="btn btn-primary" value="Passwort aktualisieren" />
                </div>
                */}
          </form>
        </div>
      </div>
    </div>
  );
}

class RegisterMaker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      postalCode: null,
      error: '',
    };

  }

  static get propTypes() {
    return {
      match: PropTypes.object,
      passwordResetToken: PropTypes.string,
    };
  }

  componentDidMount() {
  }

  // handleSubmit = (e) => {
  //   this.setState({ error: '' });
  //   const self = this;
  //   e.preventDefault();
  //
  //   if (this.state.password !== this.state.repeatPassword) {
  //     this.setState({
  //       error: 'Passwörter stimmen nicht überein.',
  //     });
  //     return false;
  //   }

  // axios.post(Config.apiBasePath + '/maker/registration', this.state)
  //   .then(function () {
  //     self.context.setAlert('Das Passwort wurde erfolgreich geändert.', 'success');
  //   })
  //   .catch(function (error) {
  //     self.setState({
  //       error: error.response.data.errors.join(', '),
  //     });
  //   });
  // }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return <RegistrationForm />;
  }
}

RegisterMaker.contextType = AppContext;

export default RegisterMaker;
