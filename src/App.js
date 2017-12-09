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
        // Store the returned data into local React state
        this.setState({ contacts: docs });
      })
  }

  submitContact(e) {
    e.preventDefault();

    // Retrieve user input name and email
    const name = ReactDOM.findDOMNode(this.refs.name).value;
    const email = ReactDOM.findDOMNode(this.refs.email).value;

    // Create the JavaScript object to push to MongoDB
    const newContact = {
      "name": name,
      "email": email,
    };

    // Push newContact to the DB
    db.collection('Contacts')
      .insertOne(newContact)
      .then(() => {
        // reset the inputs to empty string
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
