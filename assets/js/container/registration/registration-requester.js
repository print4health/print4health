import React, { useRef } from 'react';
import { Config } from '../../config';
import axios from 'axios';
import Markdown from 'react-remarkable';
import AppContext from '../../context/app-context';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import postalCodes from 'postal-codes-js';
import { withTranslation, useTranslation } from 'react-i18next';

const RegistrationForm = (props) => {

  const { callback, alert, serverErrors, showForm, countries, institutionTypes } = props;
  const { register, errors, watch, handleSubmit } = useForm();
  const { t } = useTranslation('page-registration-requester');

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
          <h1 data-cypress="registration-requester-title">{t('title')}</h1>
          <h2>{t('subtitle')}</h2>
          {alert.show &&
          <Alert variant="danger">
            <strong>{t('error')} {alert.status}</strong>: {alert.message}
          </Alert>}
          {showForm &&
          <form onSubmit={handleSubmit(callback)} className="mt-5 registration-form">
            <Markdown>{t('info', { link: '#/registration/maker' })}</Markdown>
            <Alert variant="info">
              <Markdown>{t('nonprofit')}</Markdown>
            </Alert>
            <h3>{t('data')}</h3>
            <Form.Group as={Row} controlId='registerRequesterName'>
              <Form.Label column sm='2'>{t('name.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="name"
                              placeholder={t('name.placeholder')}
                              ref={register({ required: 'Pflichtfeld', minLength: 5, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  {t('name.text')}
                  {printError(errors.name, t('name.error'))}
                  {printError(serverErrors.name, serverErrors.name)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterEmail">
              <Form.Label column sm="2">{t('mail.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="email"
                              name="email"
                              placeholder={t('mail.placeholder')}
                              ref={register({
                                required: true,
                                maxLength: 255,
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                  message: t('mail.invalid'),
                                },
                              })} />
                <Form.Text className="text-muted">
                  {t('')}
                  {printError(errors.email, t('mail.error'))}
                  {printError(serverErrors.email, serverErrors.email)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterPassword">
              <Form.Label column sm="2">{t('pass1.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="password"
                              name="password"
                              placeholder={t('pass1.placeholder')}
                              ref={register({ required: true, minLength: 8, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  {t('pass1.text')}
                  {printError(errors.password, t('pass1.error'))}
                  {printError(serverErrors.password, serverErrors.password)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterPasswordRepeat">
              <Form.Label column sm="2">{t('pass2.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="password"
                              name="passwordRepeat"
                              placeholder={t('pass2.placeholder')}
                              ref={register({ validate: value => value === password.current || t('pass2.nomatch') })} />
                <Form.Text className="text-muted">
                  {t('pass2.text')}
                  {printError(errors.passwordRepeat, t('pass2.error'))}
                </Form.Text>
              </Col>
            </Form.Group>
            <h3>{t('adr')}</h3>
            <Form.Group as={Row} controlId='registerRequesterStreet'>
              <Form.Label column sm='2'>{t('street.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="addressStreet"
                              placeholder={t('street.placeholder')}
                              ref={register({ required: 'Pflichtfeld', minLength: 1, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  {t('street.text')}
                  {printError(errors.addressStreet, t('street.error'))}
                  {printError(serverErrors.addressStreet, serverErrors.addressStreet)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterPostalCode">
              <Form.Label column sm="2">{t('plz.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="postalCode"
                              placeholder={t('plz.placeholder')}
                              ref={register({ validate: (val) => validatePostalCode(val) })} />
                <Form.Text className="text-muted">
                  {printError(errors.postalCode, t('plz.error'))}
                  {printError(serverErrors.postalCode, serverErrors.postalCode)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='registerRequesterCity'>
              <Form.Label column sm='2'>{t('city.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="addressCity"
                              placeholder={t('city.placeholder')}
                              ref={register({ required: 'Pflichtfeld', minLength: 1, maxLength: 255 })} />
                <Form.Text className="text-muted">
                  {printError(errors.addressCity, t('city.error'))}
                  {printError(serverErrors.addressCity, serverErrors.addressCity)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterPostalState">
              <Form.Label column sm="2">{t('country.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="addressState"
                              placeholder={t('country.placeholder')}
                              as="select"
                              ref={register({ required: true, minLength: 2 })}>
                  {countries.map(({ name, code }) => <option key={code} value={code}>{name}</option>)}
                </Form.Control>
                <Form.Text className="text-muted">
                  {printError(errors.addressState, t('country.error'))}
                  {printError(serverErrors.addressState, serverErrors.addressState)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterContactInfo">
              <Form.Label column sm="2">{t('contact.label')}</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="contactInfo"
                              placeholder={t('contact.placeholder')}
                              as="textarea"
                              ref={register({ required: false, maxLength: 3000 })}>
                </Form.Control>
                <Form.Text className="text-muted">
                  {t('contact.text')}
                  {printError(errors.contactInfo, t('contact.error'))}
                  {printError(serverErrors.contactInfo, serverErrors.contactInfo)}
                </Form.Text>
              </Col>
            </Form.Group>
            <h3>{t('about')}</h3>
            <Form.Group as={Row} controlId="registerRequesterInstitutionType">
              <Form.Label column sm="2">{t('type.label')}*</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="institutionType"
                              placeholder={t('type.placeholder')}
                              as="select"
                              ref={register({ required: true, minLength: 2 })}>
                  {institutionTypes.map(({ key, value }) => <option key={key} value={key}>{value}</option>)}
                </Form.Control>
                <Form.Text className="text-muted">
                  {t('type.text')}
                  {printError(errors.institutionType, t('type.error'))}
                  {printError(serverErrors.institutionType, serverErrors.institutionType)}
                </Form.Text>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="registerRequesterDescription">
              <Form.Label column sm="2">{t('description.label')}</Form.Label>
              <Col sm="10">
                <Form.Control type="text"
                              name="description"
                              placeholder={t('description.placeholder')}
                              as="textarea"
                              ref={register({ required: false, minLength: 10, maxLength: 3000 })}>
                </Form.Control>
                <Form.Text className="text-muted">
                  {t('description.text.part1')} <br />
                  <br />
                  <strong>{t('description.text.strong')}:</strong> {t('description.text.part2')}
                  {printError(errors.description, t('description.error'))}
                  {printError(serverErrors.addressState, serverErrors.addressState)}
                </Form.Text>
              </Col>
            </Form.Group>
            <h3>{t('accept.title')}</h3>
            <Alert variant="info">
              {t('accept.info')}
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
                      {t('accept.condition1')}
                    </Form.Label>
                    {printError(errors.confirmedPlattformIsContactOnly, t('accept.error'))}
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
                      {t('accept.condition2')}
                    </Form.Label>
                    {printError(errors.confirmedNoAccountability, t('accept.error'))}
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
                      {t('accept.condition3')}
                    </Form.Label>
                    {printError(errors.confirmedNoCertification, t('accept.error'))}
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
                      <Markdown>{t('accept.condition4')}</Markdown>
                    </Form.Label>
                    {printError(errors.confirmedNoAccountabiltyForMediation, t('accept.error'))}
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
                      {t('accept.condition5')}
                    </Form.Label>
                    {printError(errors.confirmedRuleMaterialAndTransport, t('accept.error'))}
                    {printError(serverErrors.confirmedRuleMaterialAndTransport, serverErrors.confirmedRuleMaterialAndTransport)}
                  </Form.Text>
                </Form.Group>
                {alert.show &&
                <Alert variant="danger">
                  <strong>{t('error')} {alert.status}</strong>: {alert.message}
                </Alert>}
                <Button variant="primary" type="submit">{t('button')}</Button>
              </Col>
            </Row>
          </form>
          }
          {showForm === false &&
          <Alert variant="success">
            <strong>{t('success')}</strong>
            <Markdown>{t('confirmation.part1', {link: '#/thing/list'})}</Markdown>
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
      t: PropTypes.func,
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
        const { t } = this.props;
        data.unshift({ name: t('choose'), code: '' });

        this.setState({ countries: data });
      }).catch(() => {
      console.log('error');
    });
  }

  initInstitutionTypes() {
    const { t } = this.props;
    const institutionTypes = [
      { key: '', value: t('institution.choose') },
      { key: 'HOSPITAL', value: t('institution.hosp') },
      { key: 'DOCTOR_LOCAL', value: t('institution.doc') },
      { key: 'NURSING_SERVICE', value: t('institution.nurse') },
      { key: 'HEALTHCARE_INSTITUTION', value: t('institution.healthcare') },
      { key: 'SOCIAL_INSTITUION', value: t('institution.social') },
      { key: 'MAKER_HUB', value: t('institution.hub') },
      { key: 'OTHER', value: t('institution.other') },
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
        const { t } = this.props;
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

export default withTranslation('page-registration-requester')(RegistrationRequester);
