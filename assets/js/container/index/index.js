import React from 'react';
import AppContext from '../../context/app-context';

class Index extends React.Component {

  componentDidMount() {
    this.context.setPageTitle('Helfen mit 3D-Druck');
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-8 col-md-12">
          <section className="container py-4">
            <h1>Helfen mit 3D-Druck</h1>
            <p className="lead mb-0">
              Der Schutz vor neuen Infektionen mit dem Coronavirus Sars-CoV-2 veranlasst die Regierungen in aller Welt
              zu
              drastischen Maßnahmen. Politische Entscheidungen beeinflussen viele Bürger/innen und der Eigen- und
              Fremdschutz hat höchste Priorität. Die zum Schutz vor Infektionen notwendigen Hilfsmittel sind allerdings
              in
              allen Ländern Mangelware. Mit 3D gedruckten Produkten könnten viele kleine Beiträge zum Schutz vor
              Infektionen
              der Bevölkerung geleistet werden.
            </p>
          </section>
          <section className="container py-4">
            <h3 className="h4">
              <i className="far fa-lightbulb fa-fw mr-2" />
              Die Idee
            </h3>
            <p className="mb-4">
              Mit unserer Plattform zum <strong>Crowdproducing</strong> soll der Einsatz von 3D-Druck zur Bekämpfung
              der Corana Pandemie effektiv, schnell und solidarisch ermöglicht werden.
              Vom hochkomplexen Produkt, das individuell konstruiert werden muss,
              bis zu Open Source Dateien für Masken, Türöffner und Wasserhahnadapter,
              die von jedem privaten 3D-Drucker gefertigt werden können, sollen Lösungen gefunden und angeboten
              werden.
            </p>
            <h3 className="h4">
              <i className="far fa-arrow-alt-circle-right mr-2" />
              Unsere Motivation
            </h3>
            <p className="mb-4">
              In pandemischen Krisenzeiten gibt es im Gesundheitssektor einen großen Bedarf an Ersatzteilen.
              Länder, in denen die Krise schon weiter fortgeschritten ist, setzen bereits auf 3D-Druck als Lösung zur
              Bedarfsdeckung im Gesundheitssektor.
              <br />
              <br />
              So unterstützen Maschinenbauer in Italien die Krankenhäuser mit 3D-gedruckten Ventilen,
              die Beatmungsgeräte mit den Gesichtsmasken der Patienten verbinden.
              <br />
              <br />
              Die Polytechnische Universität Hong Kong entwickelte Schutzschilder, um das medizinische Personal vor
              der Infizierung mit dem Coronavirus zu schützen.
              Auch diese wurden in hoher Stückzahl mit 3D-Druckern gefertigt.
            </p>
            <h3 className="h4">
              <i className="far fa-hand-point-right mr-2" />
              Wir brauchen Dich
            </h3>
            <p>
              Die Plattform lebt von der stetigen Weiterentwicklung der Plattform und der Produkte.
              Das Know-How und die Erfahrung der gesamten Community sind dabei gefragt:
              ob High-End Anwender mit großem Unternehmen im Hintergrund,
              privater 3D-Drucker, Medizintechniker oder Arzt - Euer Know-How ist wertvoll und ist wichtig!
            </p>
          </section>
          <section className="container py-4">
            <h2>So kannst du helfen</h2>
            <hr className="my-4" />
            <h3 className="h4">
              <i className="fas fa-clinic-medical mr-2" />
              Krankenhaus und soziale Einrichtung
            </h3>
            <p className="mb-4">
              Du benötigst dringend Infektionsschutz oder Teile für Geräte?
              Dann schau unter Bedarf, ob Dein Produkt schon in der Datenbank ist.
              Für Dein gewünschtes Produkt existiert noch keine Druckvorlage?
              Wende Dich mit den Anforderungen an unsere Community und entwickle gemeinsam die Druckvorlage für Deinen
              konkreten Anwendungsfall.
            </p>
            <h3 className="h4">
              <i className="fas fa-user-nurse mr-2" />
              Arzt oder Krankenpfleger
            </h3>
            <p className="mb-4">
              Du arbeitest in einer Arztpraxis, bist medizinisch technischer Assistent, in der Pflege,
              Sani oder Student im Praktischen Jahr? Du brauchst Material zum Eigenschutz? Dann schaue unter
              Bedarf,
              ob Dein Produkt schon in der Datenbank ist. Falls nicht, nimm Kontakt mit uns auf!
              Oder willst Du Deine Erfahrungen aus der letzen Schicht oder Deine Expertise mit uns teilen?
              Nimm gerne Kontakt mit uns auf! Auch Deine Erfahrung ist für die Gesellschaft so wichtig!
            </p>
            <h3 className="h4">
              <i className="fas fa-print mr-2" />
              3D-Drucker
            </h3>
            <p className="mb-4">
              Dein Drucker steht noch still? Dann schau unter Bedarf, ob Du Deine Kapazität einsetzen kannst!
              Falls Du momentan keine Druckkapazität hast, leite den Bedarf gerne an Deine
              Druckcommunity weiter!
              Vielleicht kannst Du uns auch mit Deinem Know-How helfen! Sende uns gerne eine Email!
            </p>
            <h3 className="h4">
              <i className="fas fa-palette mr-2" />
              Designer
            </h3>
            <p className="card-text">
              Du bist Techniker, Ingenieur, Designer oder einfach nur kreativ?
              Dann wirst auch Du unbedingt gebraucht!
              Deine Expertise im Bereich Medizintechnik und 3D Druck ist goldwert und kann in Zeiten der Corona
              Pandemie
              Leben retten! Nimm gerne Kontakt mit uns auf oder lade hilfreiche Dokumente in unserem upload Bereich
              hoch!
            </p>
          </section>
        </div>
      </div>
    );
  }
}

Index.contextType = AppContext;

export default Index;
