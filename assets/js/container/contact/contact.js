import React from 'react';
import { Config } from '../../config';
import {
  Alert,
  Button,
  Form,
} from 'react-bootstrap';

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

  onChangeHandler(event) {
    const file = event.target.files[0];

    if (file.size <= 3000000) {
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      });
    } else {
      window.alert('file to large');
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
          error: 'Es ist ein Fehler aufgetreten, bitte sende uns doch direkt eine E-Mail contact@print4health.org.',
        },
      });
    }

    if (response.status === 200) {
      this.setState({
        response: {
          code: 200,
          error: 'Danke für die Nachricht! Wir melden uns sobald wie möglich.',
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
    if (response.code === 200) {
      return null;
    }
    return <Form ref={(form) => this.formEl = form} onSubmit={this.handleSubmit}>
      <Form.Group controlId="formGroupName">
        <Form.Label>Name</Form.Label>
        <Form.Control name="name" type="text" placeholder="Name" required />
      </Form.Group>
      <Form.Group controlId="formGroupEmail">
        <Form.Label>E-Mail Adresse</Form.Label>
        <Form.Control name="email" type="email" placeholder="E-Mail" required />
      </Form.Group>
      <Form.Group controlId="formGroupTel">
        <Form.Label>Telefon</Form.Label>
        <Form.Control name="phone" type="text" placeholder="Telefon" />
      </Form.Group>
      <Form.Group controlId="formGroupSubject">
        <Form.Label>Betreff</Form.Label>
        <Form.Control name="subject" type="text" placeholder="Betreff" required />
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
        <Form.Label>Nachricht</Form.Label>
        <Form.Control name="message" as="textarea" rows="3" required />
      </Form.Group>
      <Button type="submit">Abschicken</Button>
    </Form>;
  }

  render() {
    return (
      <div className="container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <section className="container py-4">
                <h1 className="mb-4">Kontakt</h1>
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

export default Contact;
