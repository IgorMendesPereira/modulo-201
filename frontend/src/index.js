import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { isAuthenticated } from "./services/auth";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'


import "assets/scss/material-kit-react.scss?v=1.7.0";

// pages for this product

import LoginPage from "views/pages/LoginPage.jsx";
import Fazendas from "views/pages/Fazendas.jsx";
import Pivos from "views/pages/Pivos.jsx";
import Historicos from "views/pages/Historicos";
import Agendamentos from "views/pages/Agendamentos";
import Administrador from "views/pages/Administrador";

const localIpUrl = require('local-ip-url');
localIpUrl()

console.log("Ip FE", localIpUrl())

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
    }
  />
);

var hist = createBrowserHistory();

ReactDOM.render(
  <div>
    <ReactNotification />
    <Router history={hist}>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <PrivateRoute path="/f" component={Fazendas} />
        <PrivateRoute path="/p" component={Pivos} />
        <PrivateRoute path="/s" component={Agendamentos} />
        <PrivateRoute path="/h" component={Historicos} />
        <Route path="/adm" component={Administrador} />
        <Route path="*" component={() => <h1>Erro: Pagina não encontrada</h1>} />
      </Switch>
    </Router>
  </div>,
  document.getElementById("root")
);
