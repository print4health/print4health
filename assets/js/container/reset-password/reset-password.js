import React from 'react';
import { Config } from '../../config';
import axios from 'axios';
import AppContext from '../../context/app-context';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      repeatPassword: '',
      token: null,
      error: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static get propTypes() {
    return {
      match: PropTypes.object,
      passwordResetToken: PropTypes.string,
      t: PropTypes.func
    };
  }

  componentDidMount() {
    const { passwordResetToken } = this.props.match.params;
    this.setState({
      token: passwordResetToken,
    });
  }

  handleSubmit(e) {
    this.setState({ error: '' });
    const self = this;
    e.preventDefault();
    const { t } = this.props;

    if (this.state.password !== this.state.repeatPassword) {
      this.setState({
        error: t('reset.nomatch'),
      });
      return false;
    }

    axios.post(Config.apiBasePath + '/reset-password', this.state)
      .then(function () {
        self.context.setAlert(t('reset.success'), 'success');
      })
      .catch(function (error) {
        self.setState({
          error: error.response.data.errors.join(', '),
        });
      });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <form onSubmit={this.handleSubmit}>
              {this.state.error !== '' ? <div className="alert alert-danger">{this.state.error}</div> : null}
              <div className="form-group">
                <input name="password"
                       type="password"
                       placeholder={t('reset.placeholder1')}
                       className="form-control"
                       required
                       value={this.state.password}
                       onChange={this.handleInputChange} />
              </div>
              <div className="form-group">
                <input name="repeatPassword"
                       type="password"
                       placeholder={t('reset.placeholder2')}
                       className="form-control"
                       required
                       value={this.state.repeatPassword}
                       onChange={this.handleInputChange} />
              </div>
              <div className="form-group">
                <input type="submit" className="btn btn-primary" value={t('reset.button')} />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ResetPassword.contextType = AppContext;

export default withTranslation('modal-reset-password')(ResetPassword);
