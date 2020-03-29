import React from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { Alert,
         Button,
         Form,
         FormControl,
         FormGroup } from 'react-bootstrap';

class Contact extends React.Component {

  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        loaded: null,
        response: {
          code: 0,
          error: null,
          msg: ""
        }
      }

      this.formEl = React.createRef();
      this.fileField = React.createRef();
      this.onChangeHandler = this.onChangeHandler.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChangeHandler(event) {
    const file = event.target.files[0];

    if(file.size <= 3000000) {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        });
    } else {
        window.alert("file to large");
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const data = new FormData(form);

    this.postForm(data);
  }

  postForm(data) {
    axios.post(Config.apiBasePath + '/contact-form', data)
      .then((res) => {
        this.setState({
          response: { code: 200, msg: "Thank you for your message! We will get back to you as soon as possible." },
        });
      })
      .catch((error) => {
        this.setState({
          response: { code: 500, error: "Something went wrong, please send us an email directly at contact@print4health.org." },
        });
      });
  }

  render () {
    const { response, selectedFile } = this.state;

    return (
      <div className="container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <section className="container py-4">
                <h1>Contact form</h1>
                <p className="mb-4">
                  
                </p>
                { !response.code?
                  <Form ref={(form) => this.formEl = form} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control name="name" type="text" placeholder="Enter name" required/>
                    </Form.Group>
                    <Form.Group controlId="formGroupEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control name="email" type="email" placeholder="Enter email" required/>
                    </Form.Group>
                    <Form.Group controlId="formGroupTel">
                      <Form.Label>Telephone</Form.Label>
                      <Form.Control name="tel"  type="text" placeholder="Enter phone number" />
                    </Form.Group>
                    <Form.Group controlId="formGroupSubject">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control name="subject" type="text" placeholder="Enter subject" required/>
                    </Form.Group>
                    <Form.Group>
                     <input id="formGroupFile" ref={input => this.fileField = input} className="hide" type="file" name="file" onChange={this.onChangeHandler}/>
                     <Button className="btn btn-success" onClick={() => this.fileField.click()}>Upload Image</Button>
                     <span style={selectedFile? {marginLeft: 15, fontWeight: 500} : {marginLeft: 15}}>{selectedFile? selectedFile.name : 'Max 3MB'}</span>
                    </Form.Group>
                     <Form.Group controlId="formGroupMesg">
                      <Form.Label>Your message</Form.Label>
                      <Form.Control name="message" as="textarea" rows="3" required/>
                    </Form.Group>
                    <Button type="submit">Submit form</Button>
                  </Form>
                : <Alert variant={response.code === 200? 'success' : 'warning'}>
                    { response.error? response.error : response.msg }
                  </Alert> }
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Contact;
