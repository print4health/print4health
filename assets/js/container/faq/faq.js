import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import AppContext from '../../context/app-context';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class Faq extends React.Component {

  static get propTypes() {
    return {
      t: PropTypes.func
    };
  }

  componentDidMount() {
    this.context.setPageTitle('FAQ')
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container Faq">
        <div className="row">
          <div className="col">
            <h1>{t('title')}</h1>
        </div>
      </div>

      <div className="row mt-5">
          <div className="col-md-6 col-sm-12">
            <h3>{t('hospital.title')}</h3>
            <Accordion defaultActiveKey="10" className="shadow-sm">
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="10">
                  {t('hospital.ask1')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="10">
                  <Card.Body>
                    <p>
                      {t('hospital.ans1.part1')} <i className="fas fa-plus-circle fa-fw text-primary"></i> {t('hospital.ans1.part2')}
                    </p>
                    <p>{t('hospital.ans1.part3')}</p>
                    <p>
                      {t('hospital.ans1.part4')} <a href="mailto:contact@print4health.org">contact@print4health.org</a>
                      {t('hospital.ans1.part5')}
                    </p>
                    {/*
                    Registriert euch unter Login und hakt dabei das Kästchen _____ ab.
                    So wissen wir, dass Ihr unsere Produkte braucht und werden euch nach kurzer Verifikation einen
                    Customer Account zur Verfügung stellen.
                    */}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="11">
                  {t('hospital.ask2')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="11">
                  <Card.Body>
                    <p>
                      {t('hospital.ans2.part1')}
                    </p>
                    <p>
                      {t('hospital.ans2.part2')} <a href="mailto:contact@print4health.org">contact@print4health.org</a>.
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="12">
                  {t('hospital.ask3')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="12">
                  <Card.Body>
                    <p>
                      {t('hospital.ans3')}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
          <div className="col-md-6 col-sm-12">
            <h3>{t('maker.title')}</h3>
            <Accordion defaultActiveKey="20">
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="20">
                  {t('maker.ask1')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="20">
                  <Card.Body>
                    <p>
                      {t('maker.ans1')}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="21">
                  {t('maker.ask2')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="21">
                  <Card.Body>
                    <p>
                      {t('maker.ans2')}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="22">
                  {t('maker.ask3')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="22">
                  <Card.Body>
                    <p>
                      {t('maker.ans3')}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="23">
                  {t('maker.ask4')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="23">
                  <Card.Body>
                    <p>
                      {t('maker.ans4.part1')}
                    </p>
                    <p>
                      {t('maker.ans4.part2')}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="24">
                  {t('maker.ask5')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="24">
                  <Card.Body>
                    <p>
                      {t('maker.ans5')}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              {/*
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="25">
                  Wo kann ich neue Informationen ablegen?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="25">
                  <Card.Body>
                    <p> Im upload folder. Die Informationen werden von unserem Team gecheckt und auf der Seite in Kürze
                      zur Verfügung gestellt.</p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              */}
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="26">
                  {t('maker.ask6')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="26">
                  <Card.Body>
                    <p>
                      {t('maker.ans6.part1')}
                    </p>
                    <p>
                      {t('maker.ans6.part2')}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="27">
                  {t('maker.ask7')}
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="27">
                  <Card.Body>
                    <p>
                      {t('maker.ans7.part1')}
                    </p>
                    <p>
                      {t('maker.ans7.part2')} <a href="mailto:contact@print4health.org">contact@print4health.org</a>
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </div>
      </div>
    );
  }
}

Faq.contextType = AppContext;

export default withTranslation('faq')(Faq);
