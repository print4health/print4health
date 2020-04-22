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

  const { callback, alert, serverErrors, showForm, countries, institutionTypes } = props;
  const { register, errors, watch, handleSubmit } = useForm();

  const password = useRef({});
  password.current = watch('password', '');

  const country = useRef({});
  country.current = watch('addressState', '');

  const institutionType = useRef({});
  institutionType.current = watch('institutionTypes', '');

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
          <h1>Registrierung für Einrichtungen</h1>
          <h2>Krankenhäuser, Ärzte, gesundheitliche oder soziale Einrichtunge sowie Maker-Hubs</h2>
          {alert.show &&
          <Alert variant="danger">
            <strong>Fehler {alert.status}</strong>: {alert.message}
          </Alert>}
          {showForm &&
          <form onSubmit={handleSubmit(callback)} className="mt-5 registration-form">
            <p>
              Hier könnt ihr euch als bei <Link to="/">print4health.org</Link> registrieren und Bedarf
              an 3D gedruckten Gegenständen anmelden. Bitte füllt das Formular gewissenhaft aus, denn schließlich geht
              es darum, Menschen zu helfen.
            </p>
            <p>
              Solltet ihr ein Maker mit direktem Zugang zu einem 3D-Drucker sein, dann könnt ihr euch <Link
              to="/registration/maker">hier registrieren</Link>.
            </p>
            <Alert variant="info">
              Bei unserer Plattform handelt es sich um eine gemeinnützige Non-Profit Website, deren Mitglieder
              freiwillig und auf eigene Kosten 3D Druck-Aufträge übernehmen. Um Betrügern vorzubeugen, wird daher jede
              eurer Anmeldungen über dieses Formular <strong>manuell nach Prüfung der Daten freigeschaltet.</strong>
              Anschließend könnt ihr ohne Hürden 3D gedruckte Gegenstände &quot;bestellen.&quot;
            </Alert>
            <h3>Allgemeine Daten</h3>
            <Form.Group as={Row} controlId='registerRequesterName'>
              <Form.Label column sm='2'>Name*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="name"
                              placeholder="Name der Einrichtung / dein Name"
                              ref={register({ required: 'Pflichtfeld', minLength: 5, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  Bitte trage den Namen deiner Organisation/Einrichtung ein. Er wird bei Bestellungen und auf unserer
                  Karte öffentlich angezeigt. Mindestens fünf Zeichen sind erforderlich.
                  {printError(errors.name, 'Dies ist ein Pflichtfeld. Bitte gib min. 5 Zeichen ein.')}
                  {printError(serverErrors.name, serverErrors.name)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterEmail">
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
                  damit Maker Kontakt mit dir aufnehmen können.
                  {printError(errors.email, 'Dies ist ein Pflichtfeld. Bitte gib deine E-Mail Adresse ein.')}
                  {printError(serverErrors.email, serverErrors.email)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterPassword">
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
            <Form.Group as={Row} controlId="registerRequesterPasswordRepeat">
              <Form.Label column sm="2">Passwort wiederholen*</Form.Label>
              <Col sm="10">
                <Form.Control type="password"
                              name="passwordRepeat"
                              placeholder="Wiederhole dein Passwort"
                              ref={register({ validate: value => value === password.current || 'The passwords do not match' })} />
                <Form.Text className="text-muted">
                  Bitte gib zur Sicherheit dein Passwort zwei mal ein.
                  {printError(errors.passwordRepeat, 'Die Passwörter stimmen nicht überein')}
                </Form.Text>
              </Col>
            </Form.Group>
            <h3>Adresse</h3>
            <Form.Group as={Row} controlId='registerRequesterStreet'>
              <Form.Label column sm='2'>Straße*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="addressStreet"
                              placeholder="Deine Straße + Hausnr."
                              ref={register({ required: 'Pflichtfeld', minLength: 1, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  Deine Straße + Hausnummer wird von den Makern benötigt um gedruckte Dinge vorbei zu bringen (je
                  nachdem worauf ihr euch geeinigt habt)
                  {printError(errors.addressStreet, 'Dies ist ein Pflichtfeld. Bitte gib min. 1 Zeichen ein.')}
                  {printError(serverErrors.addressStreet, serverErrors.addressStreet)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterPostalCode">
              <Form.Label column sm="2">Postleitzahl*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="postalCode"
                              placeholder="Postleitzahl"
                              ref={register({ validate: (val) => validatePostalCode(val) })} />
                <Form.Text className="text-muted">
                  {printError(errors.postalCode, 'Dies ist ein Pflichtfeld.')}
                  {printError(serverErrors.postalCode, serverErrors.postalCode)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='registerRequesterCity'>
              <Form.Label column sm='2'>Stadt*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="addressCity"
                              placeholder="Deine Stadt."
                              ref={register({ required: 'Pflichtfeld', minLength: 1, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  {printError(errors.addressCity, 'Dies ist ein Pflichtfeld. Bitte gib min. 1 Zeichen ein.')}
                  {printError(serverErrors.addressCity, serverErrors.addressCity)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterPostalState">
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
                  {printError(errors.addressState, 'Bitte wähle dein Land aus der Liste aus.')}
                  {printError(serverErrors.addressState, serverErrors.addressState)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterContactInfo">
              <Form.Label column sm="2">Kontakt-Info</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="contactInfo"
                              placeholder="Beschreibung"
                              as="textarea"
                              ref={register({ required: false, maxLength: 3000 })}>
                </Form.Control>
                <Form.Text className="text-muted">
                  Hier kannst du Informationen die Maker hinterlegen, wo gedruckte Teile abgegeben werden können.
                  Z.B. Gebäude/Abteilung oder Warenanlieferung. Auch eine eigene Telefonnummer/E-Mail oder ähnliches
                  macht Sinn.
                  {printError(errors.contactInfo, 'Maximal 3000 Zeichen sind erlaubt.')}
                  {printError(serverErrors.contactInfo, serverErrors.contactInfo)}
                </Form.Text>
              </Col>
            </Form.Group>
            <h3>Was macht ihr?</h3>
            <Form.Group as={Row} controlId="registerRequesterInstitutionType">
              <Form.Label column sm="2">Typ</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="institutionType"
                              placeholder="Typ*"
                              as="select"
                              ref={register({ required: true, minLength: 2 })}>
                  {institutionTypes.map(({ key, value }) => <option key={key} value={key}>{value}</option>)}
                </Form.Control>
                <Form.Text className="text-muted">
                  Wähle den Typ deiner Einrichtung aus.
                  {printError(errors.institutionType, 'Bitte wähle den Typ deiner Einrichtung aus')}
                  {printError(serverErrors.institutionType, serverErrors.institutionType)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterDescription">
              <Form.Label column sm="2">Beschreibung</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="description"
                              placeholder="Beschreibung"
                              as="textarea"
                              ref={register({ required: false, minLength: 10, maxLength: 3000 })}>
                </Form.Control>
                <Form.Text className="text-muted">
                  Hier kannst du etwas über deine Einrichtung erzählen was uns hilft euch einzuordnen.
                  Aktuell wird dieser Wert noch nicht öffentlich angezeigt. <br />
                  <br />
                  <strong>Maker-Hubs:</strong> Unsere Datenbank + Kartenansicht unterstützen bereits Polygone für eure
                  Zone. Falls
                  ihr diese zur Hand habt, schreibt sie hier in die Beschreibung oder woher wir sie bekommen können.
                  Es war jetzt nur noch keine Zeit, das hier im Formular zu ergänzen.
                  {printError(errors.addressState, 'Bitte wähle dein Land aus der Liste aus.')}
                  {printError(serverErrors.addressState, serverErrors.addressState)}
                </Form.Text>
              </Col>
            </Form.Group>
            <h3>Einverständniserklärungen</h3>
            <Alert variant="info">
              Es gibt kein Kleingedrucktes, aber nimm dir bitte kurz Zeit, die folgenden Bedingungen zu bestätigen:
            </Alert>
            <Row>
              <Col sm={{ offset: 2 }}>
                <Form.Group className="d-flex" controlId="confirmedPlattformIsContactOnly">
                  <Form.Check
                    type="checkbox"
                    id="confirmedPlattformIsContactOnly"
                    name="confirmedPlattformIsContactOnly"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Mir/unserer Einrichtung ist bekannt, dass print4health ausschließlich Kontakte zwischen
                      Krankenhäusern und sonstige medizinischen und sozialen Einrichtungen sowie medizinischem Personal
                      einerseits und privaten 3D-Druckern und Designern von 3D-Druck-Bauplänen andererseits herstellt.
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
                      Mir/unserer Einrichtung ist entsprechend bewusst, dass print4health keinerlei Haftung für das
                      Zustandekommen von 3D-Druck-Design-Aufträgen bzw. 3D-Druck-Aufträgen übernimmt.
                    </Form.Label>
                    {printError(errors.confirmedNoAccountability, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedNoAccountability, serverErrors.confirmedNoAccountability)}
                  </Form.Text>
                </Form.Group>
                <Form.Group className="d-flex" controlId="confirmedNoCertification">
                  <Form.Check
                    type="checkbox"
                    id="confirmedNoCertification"
                    name="confirmedNoCertification"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Mir/unserer Einrichtung ist ferner bewusst, dass es sich vorliegend um die Vermittlung
                      ehrenamtlichen Engagements von Privatpersonen handelt und die hier angebotenen 3D-Produkte und
                      3D-Druck-Designs daher keine etwaig erforderlichen Zertifizierungsprozesse durchlaufen haben
                      und/oder etwaig bestehenden behördlichen und/oder gesetzlichen Regeln, Auflagen und/oder
                      Beschränkungen entsprechen.
                    </Form.Label>
                    {printError(errors.confirmedNoCertification, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedNoCertification, serverErrors.confirmedNoCertification)}
                  </Form.Text>
                </Form.Group>
                <Form.Group className="d-flex" controlId="confirmedNoAccountabiltyForMediation">
                  <Form.Check
                    type="checkbox"
                    id="confirmedNoAccountabiltyForMediation"
                    name="confirmedNoAccountabiltyForMediation"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Es besteht Einverständnis damit,
                      <ul className="mb-2 mt-2">
                        <li>dass print4health keinerlei Haftung für die erfolgreiche Vermittlung von
                          3D-Druck-Design-Aufträgen bzw. 3D-Druck-Aufträgen, für die Qualität der Produkte und deren
                          Eignung für den angegebenen Zweck übernimmt und
                        </li>
                        <li>dass die Vermittlung frei von Rechten Dritter erfolgt.</li>
                      </ul>
                    </Form.Label>
                    {printError(errors.confirmedNoAccountabiltyForMediation, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedNoAccountabiltyForMediation, serverErrors.confirmedNoAccountabiltyForMediation)}
                  </Form.Text>
                </Form.Group>
                <Form.Group className="d-flex" controlId="confirmedRuleMaterialAndTransport">
                  <Form.Check
                    className="mr-2"
                    type="checkbox"
                    id="confirmedRuleMaterialAndTransport"
                    name="confirmedRuleMaterialAndTransport"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      Regelungen zu etwaigen Materialkostenübernahmen sowie für etwaig anfallende Transportkosten werde
                      ich/wird unsere Einrichtung mit dem vermittelten 3D-Drucker unmittelbar treffen.
                    </Form.Label>
                    {printError(errors.confirmedRuleMaterialAndTransport, 'Bitte akzeptiere alle unsere Bedingungen für die Plattform.')}
                    {printError(serverErrors.confirmedRuleMaterialAndTransport, serverErrors.confirmedRuleMaterialAndTransport)}
                  </Form.Text>
                </Form.Group>
                {alert.show &&
                <Alert variant="danger">
                  <strong>Fehler {alert.status}</strong>: {alert.message}
                </Alert>}
                <Button variant="primary" type="submit">Als Einrichtung Registrieren</Button>
              </Col>
            </Row>
          </form>
          }
          {showForm === false &&
          <Alert variant="success">
            <strong>Registrierung erfolgreich!</strong>
            <p className="mb-0">
              Wir haben über deine Anmeldung eine E-Mail erhalten. Bitte warte noch unsere Bestätigung ab. Danach
              kannst du unter <Link to="/thing/list">Bedarf</Link> die Teile anfragen, die du benötigst.
            </p>
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

class RegistrationRequester extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      countries: [],
      institutionTypes: [],
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

    const lang = navigator.language || navigator.userLanguage;
    this.getCountryList(lang.split('-')[0].toLocaleLowerCase());
    this.initInstitutionTypes();
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

  initInstitutionTypes() {
    const institutionTypes = [
      { key: '', value: 'Bitte wählen' },
      { key: 'HOSPITAL', value: 'Krankenhaus' },
      { key: 'DOCTOR_LOCAL', value: 'niedergelassener Arzt' },
      { key: 'NURSING_SERVICE', value: 'Alten/Krankenpflege' },
      { key: 'HEALTHCARE_INSTITUTION', value: 'sonst. Gesundheitliche Einrichtung' },
      { key: 'SOCIAL_INSTITUION', value: 'Soziale Einrichtung' },
      { key: 'MAKER_HUB', value: 'Maker HUB (MakerVsVirus)' },
      { key: 'OTHER', value: 'Sonstiges (bitte beschreiben)' },
    ];

    this.setState({ institutionTypes: institutionTypes });
  }

  onSubmit = (data) => {
    console.log(data);

    const alert = {};

    axios.post(Config.apiBasePath + '/requester/registration', data)
      .then((res) => {
        if (res.data && res.data.requester && res.data.requester.id) {
          this.setState({
            showForm: false,
            alert: { show: false },
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
    const { showForm, alert, serverErrors, countries, institutionTypes } = this.state;
    return <RegistrationForm
      callback={this.onSubmit}
      alert={alert}
      serverErrors={serverErrors}
      showForm={showForm}
      countries={countries}
      institutionTypes={institutionTypes}
    />;
  }
}

RegistrationRequester.contextType = AppContext;

export default RegistrationRequester;
