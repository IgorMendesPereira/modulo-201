
import React from "react";
import openSocket from 'socket.io-client'
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Arrow from "@material-ui/icons/ArrowBack"


import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';

import Mapa from '../components/Mapa'

import pivoStyle from "assets/jss/material-kit-react/views/pivoStyle";
import Button from "components/CustomButtons/Button.jsx";
import mapImage from "assets/img/mapa.jpg";


const queryString = require('query-string')
var hostname
var socket

class Pivos extends React.Component {
  intervalID = 0
  angleIntervalID = 0

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      pivos: [],
      status_pivos: [],
    };
  }

  componentDidMount() {
    this.fazenda_id = queryString.parse(this.props.location.search).fazenda_id
    this.usuario_id = queryString.parse(this.props.location.search).usuario_id

    hostname = window.location.hostname
    if (hostname === '192.168.100.201')
      hostname = 'http://192.168.100.201:3308'
    else if (hostname === 'localhost')
      hostname = 'http://localhost:3308'
    else if (hostname === 'web.soiltech.com.br')
      hostname = 'https://web.soiltech.com.br'
    else if (hostname === 'ec2-35-173-32-138.compute-1.amazonaws.com')
      hostname = 'http://ec2-35-173-32-138.compute-1.amazonaws.com:3308'


    socket = openSocket(hostname)

    fetch(`${hostname}/pivos/${this.fazenda_id}`)
      .then(res => res.json())
      .then(res => this.setState({ pivos: res }))

    fetch(`${hostname}/status_pivos/`) //TODO No futuro filtrar por fazenda, como trabalhamos localmente nao 
      .then(res => res.json())
      .then(res => this.setState({ status_pivos: res }))

    socket.on('update_status', (status) => {
      fetch(`${hostname}/status_pivos/`) //TODO No futuro filtrar por fazenda, como trabalhamos localmente nao 
        .then(res => res.json())
        .then(res => this.setState({ status_pivos: res }))
        .then(() => {
          store.addNotification({
            title: "Mensagem!",
            message: "Status Atualizado!",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          })
        })
    })
  }

  componentWillUnmount() {
    socket.close()
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.button}>
          <Link to={{
            pathname: '/f',
            state: {
              usuario_id: this.usuario_id
            }
          }} style={{ width: '20vh' }}>
            <Button round color='primary'><Arrow />
              Fazendas</Button>
          </Link>
        </div>
        <Mapa
          push_history={true}
          map_x={540}
          map_y={371}
          radius={80}
          width={1171}
          height={580}
          image={mapImage}
          history={this.props.history}
          location={this.props.location}></Mapa>
      </div>
    );
  }
}

Pivos.propTypes = {
  classes: PropTypes.object
};

export default withStyles(pivoStyle)(Pivos);