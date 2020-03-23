import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

class Faq extends React.Component {
  render() {
    return (
      <div className="container Faq">
        <div className="row">
          <div className="col">
            <h1>FAQ - Hier findet Ihr Antworten auf Eure Fragen.</h1>
        </div>
      </div>

      <div className="row mt-5">
          <div className="col">
            <h3>Krankenhaus / soziale Einrichtung</h3>
            <Accordion defaultActiveKey="10" className="shadow-sm">
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="10">
                  Ich bin Arzt, Krankenhaus, Pflege-, Soziale oder öffentliche Einrichtung.
                  Wie kann ich Material anfragen?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="10">
                  <Card.Body>
                    <p>
                      Dazu müsst ihr euch einloggen und bei dem gewünschten Teil rechts auf das
                      <i className="fas fa-plus-circle fa-fw text-primary"></i>
                      bei "Bedarf gesamt: xxx" Klicken.
                    </p>
                    <p>Danach öffnet sich ein Fenster und ihr könnt die erforderliche Menge eintragen.</p>
                    <p>
                      Solltet ihr noch keinen Login haben, schreibt uns einfach eine kurze E-Mail an
                      <a href="mailto:contact@print4health.org">contact@print4health.org</a> und wir legen euch
                      einen Account an. Ein Formular zur Selbstregistrierung war noch nicht Teil des Hackathons,
                      kommt aber bald nach.
                    </p>
                    {/*
                    Registriert euch unter Login und hakt dabei das Kästchen _____ ab.
                    So wissen wir, dass ihr unsere Produkte braucht und werden euch nach kurzer Verifikation einen
                    Customer Account zur Verfügung stellen.
                    */}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="11">
                  Ich brauche ein sehr spezielles Bauteil, wie gehe ich am Besten vor?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="11">
                  <Card.Body>
                    <p>
                      In zukunft könnt ihr ein Bauteil mit Foto, Beschreibung, Herstellername und Spezifikation in
                      unseren Upload Bereich auf der Bedarfs-Webseite etwas hochladen.
                    </p>
                    <p>
                      Aktuell kontaktiere uns bitte direkt über Social Media oder unsere E-Mail
                      <a href="mailto:contact@print4health.org">contact@print4health.org</a>.
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="12">
                  Wie kann ich den Prozess beschleunigen, ich brauche wirklich dringend Teile?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="12">
                  <Card.Body>
                    <p>
                      Unterstützung kann bei den Behörden kann angefordert werden.
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
          <div className="col">
            <h3>FAQ Maker / Ingenieure / Designer</h3>
            <Accordion defaultActiveKey="20">
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="20">
                  Ich habe ein 3D-Drucker als Privatperson. Kann ich auch damit unterstützen?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="20">
                  <Card.Body>
                    <p>
                      Wir brauchen jede freie Druckerkapazität. Ob Industrie 3D-Drucker oder dein privater 3D-Drucker
                      zu Hause - jeder kann helfen!
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="21">
                  Was bringt mir das Drucken der Modelle?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="21">
                  <Card.Body>
                    <p>
                      Zunächst könnt ihr damit Leben retten!
                      Außerdem arbeiten wir auf freiwilliger Basis, jedoch sind wir dabei, Kooperationen zu schließen,
                      um euch für eure Arbeit mit Gutscheinen und Filament zu entlohnen.
                      Keine Sorge: Eure jetzt schon erledigten Aufträge werden mit eingerechnet.
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="22">
                  Welches Filament brauche ich und wo kann ich das bestellen?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="22">
                  <Card.Body>
                    <p>
                      In den Produktbeschreibungen findet Ihr die Materialspezifikationen.
                      Hier finden sich auch Links von Anbietern für das zu benutzende Filament.
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="23">
                  Werden die Kosten für das Filament erstattet?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="23">
                  <Card.Body>
                    <p>Wir starten zunächst mit dem Druck auf freiwilliger Basis.</p>
                    <p>
                      Wir bemühen uns aber Kooperationen zu schließen, um euch für eure Arbeit mit Gutscheinen für
                      Filament zu entlohnen.
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="24">
                  Wie kommt mein gedrucktes Teil an die Klinik, den Arzt oder den Endnutzer?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="24">
                  <Card.Body>
                    <p>Per freiwilliger Fahrer, Taxis, Behörden. Auch hier suchen wir nach freiwilligen Unterstützern.
                      Kleinere Produkte und Mengen können natürlich auch per Post versendet werden.</p>
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
                  Wen kann ich kontaktieren, wenn meine Teile fertig gedruckt sind?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="26">
                  <Card.Body>
                    <p>
                      Aktuell gibt es dazu keine Möglichkeit. Du kannst deinen Druck wie hier in der FAQ beschrieben
                      and den jeweiligen Endnutzer übermitteln.
                    </p>
                    <p>In Zukunft kannst du dies auf unser Plattform melden und es erfolgt die Organisation des
                      Transportes, damit dein Teil schnellstmöglich zum Einsatz kommt.
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="27">
                  Ich habe ein Modell gefunden, dass nützlich sein könnte, wie kann ich es bei euch einstellen?
                </Accordion.Toggle>
                <Accordion.Collapse as={Card.Body} eventKey="27">
                  <Card.Body>
                    <p>
                      Derzeit werden alle Modelle von uns händisch eingepflegt und überprüft.
                      Auch in der Zukunft ist eine kuratierung der Inhalte sinnvoll, da wir uns ganz klar auf den
                      Gesundheitsbereich beschränken wollen.
                    </p>
                    <p>
                      Es wird in der Zukunft aber auch eine Registrierung für Maker und Ingenieure geben, um 3D
                      Modelle leichter zur Verfügung stellen zu können.
                      Habt bis dahin bitte noch etwas Geduld und wendet euch mit einer Idee an <a
                      href="mailto:contact@print4health.org">contact@print4health.org</a>
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

export default Faq;
