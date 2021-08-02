import logo from "./logo.svg";
import "./App.css";
import HelloWorld from "./components/HelloWorld";
import web3 from "./web3";
import lottery from "./lottery";
import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <div>
        <HelloWorld></HelloWorld>
      </div>
    );
  }
}

export default App;
