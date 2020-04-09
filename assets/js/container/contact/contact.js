import React from 'react';
import { Config } from '../../config';
import {
  Alert,
  Button,
  Form,
} from 'react-bootstrap';
import PropTypes from "prop-types";
import { withTranslation } from 'react-i18next';

class Contact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: null,
      response: {
        code: 0,
        error: null,
        msg: '',
      },
    };

    this.fileField = React.createRef();
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static get propTypes() {
    return {
      t: PropTypes.func
    };
  }

  onChangeHandler(event) {
    const file = event.target.files[0];
    const { t } = this.props;

    if (file.size <= 3000000) {
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      });
    } else {
      window.alert(t('file'));
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const data = new FormData(form);

    this.postForm(data);
  }

  async postForm(data) {
    const { t } = this.props;

    const response = await fetch(Config.apiBasePath + '/contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(data)),
    });

    if (response.status !== 200) {
      this.setState({
        response: {
          code: 500,
          error: t('error'),
        },
      });
    }

    if (response.status === 200) {
      this.setState({
        response: {
          code: 200,
          error: t('success'),
        },
      });
    }
  }

  renderAlert() {
    const { response } = this.state;
    if (response.code === 0) {
      return null;
    }
    return <Alert variant={response.code === 200 ? 'success' : 'warning'}>
      {response.error ? response.error : response.msg}
    </Alert>;
  }

  renderForm() {
    const { response } = this.state;
    const { t } = this.props;
    if (response.code === 200) {
      return null;
    }
    return <Form ref={(form) => this.formEl = form} onSubmit={this.handleSubmit}>
      <Form.Group controlId="formGroupName">
        <Form.Label>{t('name')}</Form.Label>
        <Form.Control name="name" type="text" placeholder={t('placeholder.name')} required />
      </Form.Group>
      <Form.Group controlId="formGroupEmail">
        <Form.Label>{t('mail')}</Form.Label>
        <Form.Control name="email" type="email" placeholder={t('placeholder.mail')} required />
      </Form.Group>
      <Form.Group controlId="formGroupTel">
        <Form.Label>{t('phone')}</Form.Label>
        <Form.Control name="phone" type="text" placeholder={t('placeholder.phone')} />
      </Form.Group>
      <Form.Group controlId="formGroupSubject">
        <Form.Label>{t('subj')}</Form.Label>
        <Form.Control name="subject" type="text" placeholder={t('placeholder.subj')} required />
      </Form.Group>
      {/*<Form.Group>*/}
      {/*  <input id="formGroupFile" ref={input => this.fileField = input} className="hide" type="file"*/}
      {/*         name="file" onChange={this.onChangeHandler} />*/}
      {/*  <Button className="btn btn-success" onClick={() => this.fileField.click()}>Bild anhängen</Button>*/}
      {/*  <span style={selectedFile ? {*/}
      {/*    marginLeft: 15,*/}
      {/*    fontWeight: 500,*/}
      {/*  } : { marginLeft: 15 }}>{selectedFile ? selectedFile.name : 'Max 3MB'}</span>*/}
      {/*</Form.Group>*/}
      <Form.Group controlId="formGroupMesg">
        <Form.Label>{t('msg')}</Form.Label>
        <Form.Control name="message" as="textarea" rows="3" required />
      </Form.Group>
      <Button type="submit">{t('button')}</Button>
    </Form>;
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8 col-md-8 offset-md-2">
              <section className="container py-4">
                <h1 className="mb-4">{t('title')}</h1>
                {this.renderAlert()}
                {this.renderForm()}
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('contact')(Contact);
