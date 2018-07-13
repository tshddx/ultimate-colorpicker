import React, { Component } from "react";
import "./App.css";
import { HomePageStateful } from "./components/HomePage/HomePage";

class App extends Component {
  render() {
    return (
      <div className="App">
        <HomePageStateful />
      </div>
    );
  }
}

export default App;
