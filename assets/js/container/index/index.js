import React from 'react';
import AppContext from '../../context/app-context';
import { withTranslation } from 'react-i18next';

class Index extends React.Component {

  componentDidMount() {
    this.context.setPageTitle('Helfen mit 3D-Druck');
  }

  render() {
    const { t, i18n } = this.props;
    return (
      <div className="row">
        <div className="col-lg-8 col-md-12">
          <section className="container py-4">
            <h1>{t('intro.title')}</h1>
            <p className="lead mb-0">
              {t('intro.content')}
            </p>
          </section>
          <section className="container py-4">
            <h3 className="h4">
              <i className="far fa-lightbulb fa-fw mr-2" />
              {t('idea.title')}
            </h3>
            <p className="mb-4">
              {t('idea.content1')} <strong>{t('idea.highlight')}</strong> {t('idea.content2')}
            </p>
            <h3 className="h4">
              <i className="far fa-arrow-alt-circle-right mr-2" />
              {t('motivation.title')}
            </h3>
            <p className="mb-4">
              {t('motivation.content1')}
              <br />
              <br />
              {t('motivation.content2')}
              <br />
              <br />
              {t('motivation.content3')}
            </p>
            <h3 className="h4">
              <i className="far fa-hand-point-right mr-2" />
              {t('weneedyou.title')}
            </h3>
            <p>
              {t('weneedyou.content')}
            </p>
          </section>
          <section className="container py-4">
            <h2>{t('help.title')}</h2>
            <hr className="my-4" />
            <h3 className="h4">
              <i className="fas fa-clinic-medical mr-2" />
              {t('help.hospital.title')}
            </h3>
            <p className="mb-4">
              {t('help.hospital.content')}
            </p>
            <h3 className="h4">
              <i className="fas fa-user-nurse mr-2" />
              {t('help.doctor.title')}
            </h3>
            <p className="mb-4">
              {t('help.doctor.content')}
            </p>
            <h3 className="h4">
              <i className="fas fa-print mr-2" />
              {t('help.printer.title')}
            </h3>
            <p className="mb-4">
              {t('help.printer.content')}
            </p>
            <h3 className="h4">
              <i className="fas fa-palette mr-2" />
              {t('help.designer.title')}
            </h3>
            <p className="card-text">
              {t('help.designer.content')}
            </p>
          </section>
        </div>
      </div>
    );
  }
}

Index.contextType = AppContext;

export default withTranslation('startpage')(Index);
