import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

// DB setup
import { StitchClient } from 'mongodb-stitch';

const client = new StitchClient('contactlist-yocoj');
const db = client.service('mongodb', 'mongodb-atlas').db('ContactList');

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      contacts: []
    };

    this.submitContact = this.submitContact.bind(this);
    this.updateContacts = this.updateContacts.bind(this);
  }

  componentWillMount() {
    this.updateContacts();
  }

  updateContacts() {
    db.collection('Contacts')
      .find({})
      .execute()
      .then(docs => {
        this.setState({ contacts: docs });
      })
  }

  submitContact(e) {
    e.preventDefault();

    db.collection('Contacts')
      .insertOne({
        name: ReactDOM.findDOMNode(this.refs.name).value,
        email: ReactDOM.findDOMNode(this.refs.email).value,
      })
      .then(() => {
        ReactDOM.findDOMNode(this.refs.name).value = "";
        ReactDOM.findDOMNode(this.refs.email).value = "";
        this.updateContacts();
        alert("Contact added!");
      });
  }

  deleteContactById(id) {
    db.collection('Contacts')
      .deleteOne({ _id: id })
      .then(() => this.updateContacts())
      .catch(e => console.log(e));
  }

  deleteContacts() {
    db.collection('Contacts')
      .deleteMany({})
      .then(() => this.updateContacts())
      .catch(e => console.log(e));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" onClick={() => this.deleteContacts()} />
          <h1 className="App-title">Welcome to ContactList</h1>
        </header>
        <div className="App-intro">
          <form onSubmit={(e) => this.submitContact(e)}>
            <input type='text' placeholder='name' ref='name' />
            <input type='email' placeholder='email' ref='email' />
            <input type='submit' />
          </form>

          <div>
            {this.state.contacts.map((contact, i) => (
              <div key={i} className="contact">
                <h2>{contact.name}</h2>
                <p>{contact.email}</p>
                <div className="delete" onClick={() => this.deleteContactById(contact._id)}>Delete</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
