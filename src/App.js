import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;
    return (
        <div style={{ textAlign: "center" }}>
          {response
              ? <div> <p>
                The temperature in Santiago de Chile, Chile is: {response[0].temperature} °C
                And the time is: {response[0].time}
              </p>
              <p>
                The temperature in Zurich, Suiza is: {response[1].temperature} °C
                And the time is: {response[1].time}
              </p>
              <p>
                The temperature in Auckland, New Zealand is: {response[2].temperature} °C
                And the time is: {response[2].time}
              </p>
              <p>
                The temperature in Sidney, Australia is: {response[3].temperature} °C
                And the time is: {response[3].time}
              </p>
              <p>
                The temperature in London, United Kingdom is: {response[4].temperature} °C
                And the time is: {response[4].time}
              </p>
              <p>
                The temperature in Georgia, United States is: {response[5].temperature} °C
                And the time is: {response[5].time}
              </p></div>
              : <p>Loading...</p>}
        </div>
    );
  }
}

export default App;
/*import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
