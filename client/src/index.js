import * as serviceWorker from "./serviceWorker";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";
import App from "./components/App/App";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/login" exact component={Login} />
        <Route path="/dashboard" exact component={Dashboard} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
