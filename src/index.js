import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { AppConnected } from "./App";
import registerServiceWorker from "./registerServiceWorker";
import Settings from "./mobx/stores/Settings";

const settings = new Settings();

ReactDOM.render(
  <AppConnected settings={settings} />,
  document.getElementById("root")
);
registerServiceWorker();
