import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";
import slika from './slika.png';

function randomName() {
  const first = [
    "dobar", "lijep", "bolji", "adekvatan", "tih", "glasan", "dalek", "taman",
    "dostojan", "duga", "gladak", "glavni", "brz", "hladan", "izvrstan",
    "dojmljiv", "pametan", "crna", "malen", "veliki", "bijeli", "plavi",
    "agresivan", "zbunjen", "mokar", "kiseo", "kuhan", "lagan", "lanen", "long",
    "lak", "leden", "neaktivan", "aktivan", "iskren", "osjetljiv", "star", "mlad",
    "nespretn", "nizak", "normalan", "obiteljski", "odvazan", "otvoren", "zatvoren",
    "osjetljiv", "aktivan", "otmjen", "pasivan", "sklon", "skroman", "skup",
    "sam", "sit", "slab", "sladak"

  ];
  const second = [
    "adresa", "agresija", "akvarij", "basna", "zima", "more", "badem", "banana",
    "bajka", "brod", "jezero", "car", "centar", "artikl", "cure", "dinosaur",
    "dabar", "pas", "maca", "delta", "alfa", "drvo", "duh", "ptica",
    "leptir", "evolucija", "galeb", "gitara", "glazba", "guska", "igra", "ideja",
    "imovina", "jabuka", "jagoda", "jarac", "karakter", "stan", "zgrada",
    "dvorac", "klaun", "klavir", "kamen", "oblik", "objekt", "konj",
    "kost", "kralj", "krumpir", "kukuruz", "kuna", "labud", "sunce",
    "mjesec", "lav", "magla", "mikroskop", "naselje", "orah", "organizam", "ormar", "panda",

  ];
  const initial = first[Math.floor(Math.random() * first.length)];
  const other = second[Math.floor(Math.random() * second.length)];
  return initial +" "+ other;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("T1AsZmgzDheWM3os", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Aplikacija za razmjenu poruka</h1>
          <div className="description">
          <p>Razmjenjuj poruke sa prijateljima na siguran način putem Scaledrone servisa!</p>
          <img src={slika} alt="Logo" className="image" />
          </div>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;