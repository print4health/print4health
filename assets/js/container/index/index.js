import React from 'react';
import AppContext from '../../context/app-context';
import { Trans, withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class Index extends React.Component {

  static get propTypes() {
    return {
      t: PropTypes.func,
    };
  }

  componentDidMount() {
    const { t } = this.props;
    this.context.setPageTitle(t('pagetitle'));
  }

  render() {
    const { t } = this.props;
    return (
      <div className="row">
        <div className="col-md-8 offset-md-2">
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
              <Trans i18nKey="page-index:idea.content">
                Mit unserer Plattform <strong>Crowdproducing</strong>
                soll der Einsatz von 3D-Druck zur Bekämpfung der Corana Pandemie effektiv, schnell und solidarisch
                ermöglicht werden. Vom hochkomplexen Produkt, das individuell konstruiert werden muss, bis zu Open
                Source Dateien für Masken, Türöffner und Wasserhahnadapter, die von jedem privaten 3D-Drucker gefertigt
                werden können, sollen Lösungen gefunden und angeboten werden.
              </Trans>
            </p>
            <h3 className="h4">
              <i className="far fa-arrow-alt-circle-right mr-2" />
              {t('motivation.title')}
            </h3>
            <p className="mb-4">
              <Trans i18nKey="page-index:motivation.content">
                In pandemischen Krisenzeiten gibt es im Gesundheitssektor einen großen Bedarf an Ersatzteilen. Länder,
                in denen die Krise schon weiter fortgeschritten ist, setzen bereits auf 3D-Druck als Lösung zur
                Bedarfsdeckung im Gesundheitssektor.
                <br />
                <br />
                So unterstützen Maschinenbauer in Italien die Krankenhäuser mit 3D-gedruckten Ventilen, die
                Beatmungsgeräte mit den Gesichtsmasken der Patienten verbinden.
                <br />
                <br />
                Die polytechnische Universität Hong Kong entwickelte Schutzschilder, um das medizinische Personal vor
                der Infizierung mit dem Coronavirus zu schützen. Auch diese wurden in hoher Stückzahl mit 3D-Druckern
                gefertigt.
              </Trans>
            </p>
            <h3 className="h4">
              <i className="far fa-hand-point-right mr-2" />
              {t('weneedyou.title')}
            </h3>
            <Trans i18nKey="page-index:weneedyou.content">
              Die Plattform lebt von der stetigen Weiterentwicklung der Plattform und der Produkte. Das Know-How und die
              Erfahrung der gesamten Community sind dabei gefragt: ob High-End Anwender mit großem Unternehmen im
              Hintergrund, privater 3D-Drucker, Medizintechniker oder Arzt - Euer Know-How ist wertvoll und ist wichtig!
            </Trans>
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

export default withTranslation('page-index')(Index);
