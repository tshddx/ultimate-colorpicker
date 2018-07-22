import React, { Component } from "react";
import "./App.css";
import { HomePageStateful } from "./components/HomePage/HomePage";
import { observer } from "mobx-react";

class App extends Component {
  render() {
    return (
      <div className="App">
        <HomePageStateful settings={this.props.settings} />
      </div>
    );
  }
}

export default App;

export const AppConnected = observer(App);
