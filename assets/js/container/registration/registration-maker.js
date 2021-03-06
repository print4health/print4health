import React, { useRef } from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { withTranslation, useTranslation } from 'react-i18next';
import postalCodes from 'postal-codes-js';
import Markdown from 'react-remarkable';

const RegistrationForm = (props) => {

  const { callback, alert, serverErrors, showForm, countries } = props;
  const { register, errors, watch, handleSubmit } = useForm();

  const { t } = useTranslation('page-registration-maker');

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
          <h1 data-cypress="registration-maker-title">{t('title')}</h1>
          <Alert variant="info" className="mt-3">
            <Markdown>{t('info_hospital')}</Markdown>
          </Alert>
          {alert.show &&
          <Alert variant="danger">
            <strong>{t('error')} {alert.status}</strong>: {alert.message}
          </Alert>}
          {showForm &&
          <form onSubmit={handleSubmit(callback)} className="mt-5 registration-form">

            {/*todo: generate link with <Link ?*/}
            <Markdown>{t('info', {
              link: '#/registration/requester',
            })}</Markdown>

            <h3>{t('data')}</h3>
            <Form.Group as={Row} controlId="registerMakerName">
              <Form.Label column sm="2">{t('namefield.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="name"
                              placeholder={t('namefield.placeholder')}
                              ref={register({ required: 'Pflichtfeld', minLength: 5, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  {t('namefield.info')}
                  {printError(errors.name, t('namefield.errorrequired'))}
                  {printError(serverErrors.name, serverErrors.name)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerEmail">
              <Form.Label column sm="2">{t('mailfield.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="email"
                              name="email"
                              placeholder={t('mailfield.placeholder')}
                              ref={register({
                                required: true,
                                maxLength: 255,
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                  message: t('mailfield.invalid'),
                                },
                              })} />
                <Form.Text className="text-muted">
                  {t('mailfield.info')}
                  {printError(errors.email, t('mailfield.errorrequired'))}
                  {printError(serverErrors.email, serverErrors.email)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPassword">
              <Form.Label column sm="2">{t('passfield1.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="password"
                              name="password"
                              placeholder={t('passfield1.placeholder')}
                              ref={register({ required: true, minLength: 8, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  {t('passfield1.info')}
                  {printError(errors.password, t('passfield1.errorrequired'))}
                  {printError(serverErrors.password, serverErrors.password)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPassword">
              <Form.Label column sm="2">{t('passfield2.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="password"
                              name="passwordRepeat"
                              placeholder={t('passfield2.placeholder')}
                              ref={register({ validate: value => value === password.current || 'The passwords do not match' })} />
                <Form.Text className="text-muted">
                  {t('passfield2.info')}
                  {printError(errors.passwordRepeat, t('passfield2.error'))}
                </Form.Text>
              </Col>
            </Form.Group>
            <h3>Ort</h3>
            <Form.Group as={Row} controlId="registerMakerPostalCode">
              <Form.Label column sm="2">{t('plz.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="postalCode"
                              placeholder={t('plz.placeholder')}
                              ref={register({ validate: (val) => validatePostalCode(val) })} />
                <Form.Text className="text-muted">
                  {t('plz.info')}
                  {printError(errors.postalCode, t('plz.errorrequired'))}
                  {printError(serverErrors.postalCode, serverErrors.postalCode)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerMakerPostalState">
              <Form.Label column sm="2">{t('country.label')}</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="addressState"
                              placeholder={t('country.placeholder')}
                              as="select"
                              ref={register({ required: true, minLength: 2 })}>
                  {countries.map(({ name, code }) => <option key={code} value={code}>{name}</option>)}
                  <Form.Text className="text-muted">
                    {t('country.info')}
                    {printError(errors.addressState, t('country.label'))}
                    {printError(serverErrors.addressState, serverErrors.addressState)}
                  </Form.Text>
                </Form.Control>
              </Col>
            </Form.Group>
            <h3>{t('accept.label')}</h3>
            <Alert variant="info">
              {t('accept.overview')}
            </Alert>
            <Row>
              <Col sm={{ offset: 2 }}>
                <Form.Group className="d-flex" controlId="confirmedRuleForFree">
                  <Form.Check
                    type="checkbox"
                    id="confirmedRuleForFree"
                    name="confirmedRuleForFree"
                    ref={register({ required: true })}
                  />
                  <Form.Text className="col-sm-11 flex-grow-1">
                    <Form.Label>
                      {t('accept.condition1')}
                    </Form.Label>
                    {printError(errors.confirmedRuleForFree, t('accept.errorrequired'))}
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
                      {t('accept.condition2')}
                    </Form.Label>
                    {printError(errors.confirmedRuleMaterialAndTransport, t('accept.errorrequired'))}
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
                      {t('accept.condition3')}
                    </Form.Label>
                    {printError(errors.confirmedPlattformIsContactOnly, t('accept.errorrequired'))}
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
                      <Markdown>{t('accept.condition4')}</Markdown>
                    </Form.Label>
                    {printError(errors.confirmedNoAccountability, t('accept.errorrequired'))}
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
                      {t('accept.condition5')}
                    </Form.Label>
                    {printError(errors.confirmedPersonalDataTransferToRequester, t('accept.errorrequired'))}
                    {printError(serverErrors.confirmedPersonalDataTransferToRequester, serverErrors.confirmedPersonalDataTransferToRequester)}
                  </Form.Text>
                </Form.Group>
                {alert.show &&
                <Alert variant="danger">
                  <strong>{t('error.headline', { code: alert.status })}</strong>:
                  {t('error.message')}<br />
                  <br />
                  {alert.message}
                </Alert>}
                <Button variant="primary" type="submit">{t('button')}</Button>
              </Col>
            </Row>
          </form>
          }
          {showForm === false &&
          <Alert variant="success" data-cypress="registration-maker-success">
            <strong>{t('success.headline')}</strong>
            <Markdown>{t('success.message', { link: '#/thing/list' })}</Markdown>
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

class RegistrationMaker extends React.Component {

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
      t: PropTypes.func,
    };
  }

  componentDidMount() {
    if (this.context.user && this.context.user.id) {
      // todo redirect to home?
    }

    const lang = navigator.language || navigator.userLanguage;
    this.getCountryList(lang.split('-')[0].toLocaleLowerCase());
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
            alert: { show: false },
          });
        }
      })
      .catch((srvErr) => {
        const { t } = this.props;
        if (typeof (srvErr.response) === 'undefined') {
          console.log(srvErr);
          return;
        }
        const response = srvErr.response;
        if (response.status === 422) {

          alert.show = true;
          alert.status = response.status;
          alert.message = t('fail');

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

RegistrationMaker.contextType = AppContext;

export default withTranslation('page-registration-maker')(RegistrationMaker);
