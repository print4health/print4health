import React from 'react';
import { Accordion, Alert, Button, Card } from 'react-bootstrap';

class Imprint extends React.Component {
  render() {
    return (
      <div className="container imprint">
        <div className="row">
          <div className="col">
            <h1>Impressum</h1>
            <Alert variant="info">
              print4health.org ist ein gemscheinschaftliches Projekt, dass im Rahmen des <a
              href="https://www.bundesregierung.de/breg-de/themen/coronavirus/wir-vs-virus-1731968"
              target="_blank"><strong>Hackathons WirVsWirus</strong></a> entstanden ist.<br />
              Es dient derzeit als Prototyp der eingereichten Idee <a href="https://devpost.com/software/print4health"
                                                                      target="_blank"><strong>06_Medizingeräteherstellung_print4health</strong></a> und ist als Non-Profit OpenSource Projekt angelegt.
            </Alert>
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              print4health<br />
              Conrad Barthelmes<br />
              Goetheweg 2b<br />
              41469 Neuss</p>
            <h2>Kontakt</h2>
            <p>E-Mail: <a href="mailto: contact@print4health.org">contact@print4health.org</a></p>
            <h3>Haftung für Inhalte</h3>
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf
              diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
              überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
            <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
              bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
              konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.</p>

            <h3>Haftung für Links</h3>
            <p>Unser Angebot enthält Links zu externen Websites
              Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
              keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
              Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
              mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
              erkennbar.</p>
            <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
              Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links
              umgehend entfernen.</p>

            <h3>Urheberrecht</h3>
            <p>Die durch die Seitenbetreiber erstellten Inhalte und
              Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur
              für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
            <p>Soweit die Inhalte auf dieser Seite nicht vom
              Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter
              als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
              wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte
              umgehend entfernen.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Imprint;
