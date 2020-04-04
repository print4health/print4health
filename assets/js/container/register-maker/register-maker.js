import React, { useRef } from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import postalCodes from 'postal-codes-js';

const RegistrationForm = (props) => {

  const { callback, alert, serverErrors, showForm, countries } = props;
  const { register, errors, watch, handleSubmit } = useForm();

  const password = useRef({});
  password.current = watch('password', '');

  const country = useRef({});
  country.current = watch('addressState', '');

  const validatePostalCode = (postalCode) => {
    return postalCodes.validate(country.current, postalCode);
  };

  const printError = (error, message) => {
    if (!error) {
      return;
    }
    return (
      <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1>Maker Registrierung</h1>
          <Alert variant="info" className="mt-3">
            Um Bedarf anzumelden, müsst ihr als <strong>Krankenhaus, Arzt, soziale Einrichtung oder
            Maker-Hub (<a href="https://www.makervsvirus.org/" target="_blank"
                          rel="noopener noreferrer">MakerVsVirus</a>)</strong> angemeldet
            sein.
            <br />
            Die Registrierung dafür wird aktuell noch vorbereitet. Schreibt uns einfach eine E-Mail
            an <a href="mailto:contact@print4health.org">contact@print4health.org</a> dann kümmern wir uns so schnell
            es geht darum.
          </Alert>
          {alert.show &&
          <Alert variant="danger">
            <strong>Fehler {alert.status}</strong>: {alert.message}
          </Alert>}
          {showForm &&
          <form onSubmit={handleSubmit(callback)} className="mt-5 registration-form">
            <p>
              Hier könnt ihr euch als Maker bei <span className="text-primary">print4health.org</span> registrieren.
              Bitte füllt das Formular gewissenhaft aus, denn schließlich geht es darum, Menschen zu helfen.
            </p>
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
                  {printError(errors.name, 'Dies ist ein Pflichtfeld. Bitte gib min. 5 Zeichen ein.')}
                  {printError(serverErrors.name, serverErrors.name)}
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
                  {printError(errors.email, 'Dies ist ein Pflichtfeld. Bitte gib deine E-Mail Adresse ein.')}
                  {printError(serverErrors.email, serverErrors.email)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPassword">
              <Form.Label column sm="2">Passwort*</Form.Label>
              <Col sm="10">
                <Form.Control type="password"
                              name="password"
                              placeholder="Dein Passwort"
                              ref={register({ required: true, minLength: 8, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  Dein Passwort für print4health.org. Am besten du wählst ein langes mit vielen Sonderzeichen und es
                  steht nirgendwo im Wörterbuch oder ist leicht zu erraten.
                  {printError(errors.password, 'Dies ist ein Pflichtfeld. Dein Passwort sollte min. 8 Zeichen lang sein.')}
                  {printError(serverErrors.password, serverErrors.password)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPasswordRepet">
              <Form.Label column sm="2">Passwort wiederholen*</Form.Label>
              <Col sm="10">
                <Form.Control type="password"
                              name="passwordRepeat"
                              placeholder="Wiederhole dein Passwort"
                              ref={register({ validate: value => value === password.current })} />
                <Form.Text className="text-muted">
                  Bitte gib zur Sicherheit dein Passwort zwei mal ein.
                  {printError(errors.passwordRepeat, 'Die Passwörter stimmen nicht überein')}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPostalCode">
              <Form.Label column sm="2">Postleitzahl*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="postalCode"
                              placeholder="Postleitzahl"
                              ref={register({ validate: (val) => validatePostalCode(val) })} />
                <Form.Text className="text-muted">
                  Deine Postleitzahl wird verwendet um dich bei einer nächsten Version auf einer Karte anzuzeigen, damit
                  eine Einrichtung in deiner Nähe sehen kann, dass du zur Verfügung stehst.
                  {printError(errors.postalCode, 'Dies ist ein Pflichtfeld. Deine Postleitzahl sollte 4 oder 5 Zeichen lang sein.')}
                  {printError(serverErrors.postalCode, serverErrors.postalCode)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPostalState">
              <Form.Label column sm="2">Land</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="addressState"
                              placeholder="Land*"
                              as="select"
                              ref={register({ required: true, minLength: 2 })}>
                  {countries.map(({ name, code }) => <option key={code} value={code}>{name}</option>)}
                </Form.Control>
                <Form.Text className="text-muted">
                  Das Land in dem du Wohnst (Pflichtfeld da dieses mit der Postleitzahl verwendet wird um deine
                  ungefähre Position zu speichern)
                  {printError(errors.addressState, 'Bitte wähle dein Land aus der Liste aus.')}
                  {printError(serverErrors.addressState, serverErrors.addressState)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Row>
              <Col sm={{ offset: 2 }}>
                <h3>Einverständniserklärungen</h3>
                <Form.Group className="d-flex" controlId="confirmedRuleForFree">
                  <Form.Check
                    type="checkbox"
                    id="confirmedRuleForFree"
                    name="confirmedRuleForFree"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Ich erkläre mich im Umfang meiner Möglichkeiten bereit, nach besten Möglichkeiten und
                      Fähigkeiten kostenlos 3D-Drucke für Krankenhäuser und sonstige medizinische und soziale
                      Einrichtungen sowie medizinisches Personal herzustellen, die auf dieser Internetpräsenz
                      registriert sind.
                    </Form.Label>
                    {printError(errors.confirmedRuleForFree, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedRuleForFree, serverErrors.confirmedRuleForFree)}
                  </Form.Text>
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
                    {printError(errors.confirmedRuleMaterialAndTransport, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedRuleMaterialAndTransport, serverErrors.confirmedRuleMaterialAndTransport)}
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
                    {printError(errors.confirmedPlattformIsContactOnly, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedPlattformIsContactOnly, serverErrors.confirmedPlattformIsContactOnly)}
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
                    {printError(errors.confirmedNoAccountability, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedNoAccountability, serverErrors.confirmedNoAccountability)}
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
                    {printError(errors.confirmedPersonalDataTransferToRequester, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedPersonalDataTransferToRequester, serverErrors.confirmedPersonalDataTransferToRequester)}
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">Als Maker Registrieren</Button>
              </Col>
            </Row>
          </form>
          }
          {showForm === false &&
          <Alert variant="success">
            <strong>Registrierung erfolgreich!</strong>
            <p className="mb-0">Nun kannst du dich Anmelden und zum <Link to="/thing/list">Bedarf</Link> und
              Druckaufträge Druckaufträge zusagen.</p>
          </Alert>
          }
        </div>
      </div>
    </div>
  );
};

// satisfies eslint.. hmm
RegistrationForm.propTypes = () => {
  return {};
};

class RegisterMaker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      countries: [],
      alert: {
        show: false,
        status: null,
        message: '',
      },
      serverErrors: {},
    };
  }

  static get propTypes() {
    return {
      match: PropTypes.object,
      passwordResetToken: PropTypes.string,
    };
  }

  componentDidMount() {
    if (this.context.user && this.context.user.id) {
      // todo redirect to home?
    }

    this.getCountryList('de');
  }

  getCountryList(lang) {
    const url = `/build/meta/country-codes.json`;
    const langIsSupported = ['de', 'es', 'fr', 'ja', 'it', 'br', 'pt'].includes(lang);

    axios.get(url)
      .then((result) => {
        const data = result.data.map((
          { name, translations, alpha2Code }) => {
            name = lang === 'en' || !langIsSupported ? name : translations[lang];
            name = `${name} (${alpha2Code})`;
            return {
              name: name,
              code: alpha2Code,
            };
          },
        );

        data.sort((a, b) => {
          if (a.name === b.name) {
            return 0;
          }
          return a.name > b.name ? 1 : -1;
        });

        data.unshift({ name: 'Bitte wählen', code: '' });

        this.setState({ countries: data });
      }).catch(() => {
      console.log('error');
    });
  }

  onSubmit = (data) => {
    const alert = {};

    axios.post(Config.apiBasePath + '/maker/registration', data)
      .then((res) => {
        if (res.data && res.data.maker && res.data.maker.id) {
          this.setState({
            showForm: false,
          });
        }
      })
      .catch((srvErr) => {
        if (typeof (srvErr.response) === 'undefined') {
          console.log(srvErr);
          return;
        }
        const response = srvErr.response;
        if (response.status === 422) {

          alert.show = true;
          alert.status = response.status;
          alert.message = 'Die Registrierung konnte nicht abgeschlossen werden. Bitte überprüfe die Daten in den Eingabefeldern.';

          let errors = {};
          // todo make hook or component for this for validation errors and more sophisticated? ;)
          if (response.data.errors) {
            for (const error of response.data.errors) {
              if (error && typeof (error.propertyPath) === 'string') {
                errors[error.propertyPath] = error.message;
              }
            }
          }
          this.setState({
            alert: alert,
            serverErrors: errors,
          });

        } else {
          alert.show = true;
          alert.status = response.status;
          alert.message = response.statusText;
        }
      });
  };

  render() {
    const { showForm, alert, serverErrors, countries } = this.state;
    return <RegistrationForm
      callback={this.onSubmit}
      alert={alert}
      serverErrors={serverErrors}
      showForm={showForm}
      countries={countries} />;
  }
}

RegisterMaker.contextType = AppContext;

export default RegisterMaker;
