
import React from "react";
import openSocket from 'socket.io-client'
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Arrow from "@material-ui/icons/ArrowBack"
import Map from "@material-ui/icons/Map"

import { Link } from "react-router-dom";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardHistorico from '../components/CardHistorico'
import Paginations from "components/Pagination/Pagination.jsx"

import Button from "components/CustomButtons/Button.jsx";
import { store } from 'react-notifications-component';

import historicoStyle from "assets/jss/material-kit-react/views/historicoStyle.jsx";

import image from "assets/img/pivo.png";
import water_on from "assets/img/water_on.png";
import water_off from "assets/img/water_off.png";
import rotate_left from "assets/img/rotate_left_small.png";
import rotate_right from "assets/img/rotate_right_small.png";

const queryString = require('query-string');

var hostname
var socket

class Historicos extends React.Component {

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      historicos: [],
      historicos_tratados: [],
      pages: [],
      curPage: 0,
      elementsPerPage: 15
    };
  }

  createPage() {
    var page = []
    var historico = 0

    if (this.state.historicos_tratados.length > 0) {
      for (var i = 0; i < this.state.elementsPerPage; i++) {
        historico = this.state.historicos_tratados[(this.state.curPage * this.state.elementsPerPage + i)]

        if (historico != null) {
          page.push(
            <CardHistorico key={historico.historico_pivo_id}
              date={this.parseDate(historico.createdAt)}
              on_off={historico.on_off}
              front_back={historico.front_back}
              water={historico.water}
              percent={historico.percent}
              pressure={historico.pressure}
              volt={historico.volt}></CardHistorico>
          )
        }
      }
    }

    return page
  }

  parseDate(createdAt) {
    const t = createdAt.split(/[- T.Z :]/)
    const parsedDate = `Dia: ${t[2]}/${t[1]}/${t[0]} Horario: ${t[3]}:${t[4]}:${t[5]}`
    return parsedDate
  }

  async componentDidMount() {
    // we add a hidden class to the stopcard and after 700 ms we delete it and the transition appears
    this.fazenda_id = queryString.parse(this.props.location.search).fazenda_id
    this.usuario_id = queryString.parse(this.props.location.search).usuario_id
    const modulo_id = queryString.parse(this.props.location.search).modulo_id
    this.modulo_id = modulo_id

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

    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );

    const response = await fetch(`${hostname}/historicos/${modulo_id}`)
    const json = await response.json()

    this.setState({ historicos: json })
    this.tratarHistorico(json)

    socket.on('update_status', (status) => {
      fetch(`${hostname}/historicos/${this.modulo_id}`)
        .then(res => res.json())
        .then(res => this.setState({ historicos: res }))
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

  tratarHistorico(res) {
    this.prepararHistoricoTratado(res) //Transforma informacao bruta em informacao legivel pelo usuario
    this.prepararPagination(res)
  }

  prepararPagination(res) {
    var pages = []
    const length = res.length
    const numPages = Math.ceil(length / this.state.elementsPerPage)

    for (var i = 0; i < numPages; i++)
      pages.push({ text: i })

    this.setState({ pages })
  }

  setarPagina(page) {
    this.setState({ curPage: page })
  }

  prepararHistoricoTratado(res) {
    var at = [] //Historicos a serem retornados
    var modulo_id = 0
    var createdAt = 0
    var on_off = 0
    var front_back = 0
    var water = 0
    var percent = 0
    var volt = 0
    var pressure = 0
    var historico_pivo_id = 0
    var historico_tratado = {}

    console.log('data', res)

    if (res.length >= 0)
      res.forEach(historico => {
        if (historico.on_off === 1)
          on_off = 'Ligado'
        else if (historico.on_off === 2)
          on_off = 'Desligado'

        if (historico.front_back === 3)
          front_back = rotate_right
        else if (historico.front_back === 4)
          front_back = rotate_left
        else if (historico.front_back === 0)
          front_back = 0

        if (historico.water === 6)
          water = water_on
        else if (historico.water === 5)
          water = water_off

        percent = historico.percent
        volt = historico.volt
        pressure = historico.pressure
        createdAt = historico.createdAt
        modulo_id = historico.modulo_id
        historico_pivo_id = historico.historico_pivo_id

        historico_tratado = {
          historico_pivo_id,
          modulo_id,
          createdAt,
          on_off,
          front_back,
          water,
          percent,
          volt,
          pressure
        }

        at.push(historico_tratado)
      })

    this.setState({ historicos_tratados: at })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}

        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={10} sm={10} md={10}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <CardBody className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Histórico</h4>
                    </CardHeader>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <Link to={`/s?modulo_id=${this.modulo_id}&fazenda_id=${this.fazenda_id}&usuario_id=${this.usuario_id}`} className={classes.link}>
                          <Button round color="primary" size="lg" style={{ width: '100%' }}>
                            <Arrow />Voltar
                                </Button>
                        </Link>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <Link to={`/p?fazenda_id=${this.fazenda_id}&usuario_id=${this.usuario_id}`} className={classes.link}>
                          <Button round color="primary" size="lg" style={{ width: '100%' }}>
                            <Map />Mapa
                                 </Button>
                        </Link>
                      </GridItem>
                    </GridContainer>
                    <CardBody>
                      {this.createPage()}
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <GridContainer>
                        <div justify='center' style={{ width: '100%', display: 'inline-block', textAlign: 'center' }}>
                          <Paginations setPage={this.setarPagina.bind(this)} className={classes.pagination} pages={this.state.pages} onClick={e => console.log(`clicado em pagina`)}></Paginations>
                        </div>
                      </GridContainer>
                    </CardFooter>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div >
    );
  }
}

Historicos.propTypes = {
  classes: PropTypes.object
};

export default withStyles(historicoStyle)(Historicos);
