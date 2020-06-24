import React from 'react';
import PropTypes from 'prop-types';
import openSocket from 'socket.io-client';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import Button from 'components/CustomButtons/Button.jsx';
import CardActions from '@material-ui/core/CardActions';
import CardBody from 'components/Card/CardBody.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';

import water_on from 'assets/img/water_on.png';
import water_off from 'assets/img/water_off.png';
import rotate_left from 'assets/img/rotate_left_small.png';
import rotate_right from 'assets/img/rotate_right_small.png';
import mapImage from 'assets/img/pivo_cortado.png';
import pivo from 'assets/img/cardStatus/pivo.jpeg';
import stop from 'assets/img/cardStatus/stop.png';
import play from 'assets/img/cardStatus/play.png';

import legenda_azul from 'assets/img/cardStatus/legenda_azul.png';
import legenda_vermelho from 'assets/img/cardStatus/legenda_vermelho.png';
import legenda_cinza from 'assets/img/cardStatus/legenda_cinza.png';
import legenda_marrom from 'assets/img/cardStatus/legenda_marrom.png';
import cardStatusStyle from 'assets/jss/material-kit-react/components/cardStatusStyle';

import { TextField } from '@material-ui/core';

import Done from '@material-ui/icons/Done';
import Cancel from '@material-ui/icons/Cancel';

import Mapa from '../components/Mapa';

const axios = require('axios');
var hostname;
var socket;
var status;

const queryString = require('query-string');

class CardStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      hasDecided: false,
      on: false,
      front: false,
      water: false,
      percent: 0,
      inputPercent: 0,
      isTurnedOff: false
    };
    this.modulo_id = queryString.parse(
      props.location.search
    ).modulo_id;

    status = {
      on_off: '1',
      front_back: '3',
      water: '5'
    };
  }

  async componentDidMount() {
    hostname = window.location.hostname;
    if (hostname === '192.168.100.201')
      hostname = 'http://192.168.100.201:3308';
    else if (hostname === 'localhost') hostname = 'http://localhost:3308';
    else if (hostname === 'web.soiltech.com.br')
      hostname = 'https://web.soiltech.com.br:3308';
    else if (hostname === 'ec2-35-173-32-138.compute-1.amazonaws.com')
      hostname = 'http://ec2-35-173-32-138.compute-1.amazonaws.com:3308';

    socket = openSocket(hostname);
    console.log(this.modulo_id)

    var response = await fetch(`${hostname}/status_pivos/${this.modulo_id}`)
    const json = await response.json()

    status = json[0]
    this.decidirBotoes()

    socket.on('update_status', status => {
      if (status.modulo_id === this.modulo_id) {

        this.setState({
          percent: status.percent,
          inputPercent: status.percent
        })
        console.log('O AQUI', status)
        if (status.on_off == '1') {
          this.setOn(true);
          this.setState({ isTurnedOff: false });
        } else if (status.on_off == '2') {
          this.setOn(false);
          this.setState({ isTurnedOff: true });
        }

        if (status.front_back == '3') this.setFront(true);
        else if (status.front_back == '4') this.setFront(false);

        if (status.water == '5') this.setWater(false);
        else if (status.water == '6') this.setWater(true);
      }
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardBody>
          <GridContainer style={{ width: '100%', margin: '0', padding: '0' }}>
            <GridItem xs={12} sm={3} md={3} style={{ padding: '0' }}>
              <Mapa
                push_history={false}
                map_x={82}
                map_y={142}
                radius={74}
                width={165}
                height={255}
                image={mapImage}
                history={this.props.history}
                location={this.props.location}
                front_back={status.front_back}
              ></Mapa>
              {/* <img src={pivo_cortado} className={classes.imagemMapa} alt='Imagem de cima de uma fazenda' /> */}
            </GridItem>

            <GridItem
              xs={12}
              sm={9}
              md={9}
              style={{ padding: '0', textAlign: 'center' }}
            >
              <div
                style={{
                  backgroundImage: 'url(' + pivo + ')',
                  backgroundSize: '100% 100%',
                  width: '100%',
                  height: '100%'
                }}
              >
                <GridContainer
                  style={{
                    margin: '0',
                    paddingBottom: '50px',
                    paddingTop: '20px'
                  }}
                >
                  <GridItem xs={6} sm={6} md={6}>
                    <h4 className={classes.bolded}>Voltímetro</h4>
                    <h4 className={classes.bolded}>0V</h4>
                  </GridItem>

                  <GridItem xs={6} sm={6} md={6}>
                    <h4 className={classes.bolded}>Percentímetro</h4>
                    <h4 className={classes.bolded}>{this.state.percent}</h4>
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ margin: '0', paddingBottom: '20px' }}>
                  <GridItem xs={12} sm={12} md={12}>
                    <h4 className={classes.bolded}>Desligar</h4>
                    <GridContainer>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        style={{ margin: '0 auto', width: '50%' }}
                      >
                        <div
                          className={
                            !this.state.on
                              ? classes.selected
                              : classes.disselected
                          }
                          onClick={this.handleStopClick}
                        >
                          <img
                            className={classes.actionButtons}
                            src={stop}
                            alt='Parar'
                          ></img>
                        </div>
                      </GridItem>

                      <GridItem xs={6} sm={6} md={6}>
                        <div
                          className={
                            this.state.on
                              ? classes.selected
                              : classes.disselected
                          }
                          onClick={this.handlePlayClick}
                        >
                          <img
                            className={classes.actionButtons}
                            src={play}
                            alt='Play'
                          ></img>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={4} md={4}>
                    <h4 className={classes.bolded}>Sentido</h4>
                    <GridContainer>
                      <GridItem xs={6} sm={6} md={6}>
                        <div
                          className={
                            !this.state.front
                              ? classes.selected
                              : classes.disselected
                          }
                          onClick={this.handleRotateLeftClick}
                        >
                          <img
                            className={classes.actionButtons}
                            src={rotate_left}
                            alt='Rotacionar esquerda'
                          ></img>
                        </div>
                      </GridItem>

                      <GridItem xs={6} sm={6} md={6}>
                        <div
                          className={
                            this.state.front
                              ? classes.selected
                              : classes.disselected
                          }
                          onClick={this.handleRotateRightClick}
                        >
                          <img
                            className={classes.actionButtons}
                            src={rotate_right}
                            alt='Rotacionar direita'
                          ></img>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </GridItem>

                  <GridItem xs={12} sm={4} md={4}>
                    <h4 className={classes.bolded}>Agua</h4>
                    <GridContainer>
                      <GridItem xs={6} sm={6} md={6}>
                        <div
                          className={
                            !this.state.water
                              ? classes.selected
                              : classes.disselected
                          }
                          onClick={this.handleWaterOffClick}
                        >
                          <img
                            className={classes.actionButtons}
                            src={water_off}
                            alt='Agua desligada'
                          ></img>
                        </div>
                      </GridItem>

                      <GridItem xs={6} sm={6} md={6}>
                        <div
                          className={
                            this.state.water
                              ? classes.selected
                              : classes.disselected
                          }
                          onClick={this.handleWaterOnClick}
                        >
                          <img
                            className={classes.actionButtons}
                            src={water_on}
                            alt='Agua ligada'
                          ></img>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </GridItem>

                  <GridItem style={{ padding: '0' }} xs={12} sm={4} md={4}>
                    <h4 className={classes.bolded}>Percentimetro</h4>


                    <GridContainer>
                      <GridItem style={{ padding: '0' }} xs={3} sm={3} md={3}>
                        <Button color='facebook' onClick={() => this.handlePercentClick(0)} style={{ maxWidth: '100%' }}><strong>-5</strong></Button>
                      </GridItem>

                      <GridItem xs={5} sm={5} md={5}>
                        <TextField onChange={(valueAsNumber) => this.handlePercentChange(valueAsNumber.target.value)} value={this.state.inputPercent} variant='outlined' style={{ '-webkit-appearance': 'none' }}></TextField>
                      </GridItem>

                      <GridItem style={{ padding: '0' }} xs={3} sm={3} md={3}>
                        <Button color='facebook' onClick={() => this.handlePercentClick(1)} style={{ maxWidth: '100%' }}><strong>+5</strong></Button>
                      </GridItem>
                    </GridContainer>

                  </GridItem>
                </GridContainer>
                <GridContainer style={{ marginTop: '30px' }}>
                  <GridItem xs={12} sm={6} md={6}>
                    <Button
                      className={
                        this.state.expanded ? classes.appear : classes.disappear
                      }
                      onClick={this.handleConfirmClick}
                      round
                      color='primary'
                      style={{ color: 'white' }}
                    >
                      <Done />
                      Confirmar
                    </Button>
                  </GridItem>

                  <GridItem xs={12} sm={6} md={6}>
                    <Button
                      className={
                        this.state.expanded ? classes.appear : classes.disappear
                      }
                      onClick={this.handleCancelClick}
                      round
                      color='danger'
                      style={{ color: 'white' }}
                    >
                      <Cancel />
                      Cancelar
                    </Button>
                  </GridItem>
                </GridContainer>
              </div>
            </GridItem>
          </GridContainer>
          <CardActions className={classes.cardActions}>
            <GridContainer style={{ width: '100%' }}>
              <GridItem xs={12} sm={4} md={3}>
                <h3 style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                  Legenda:{' '}
                </h3>
              </GridItem>

              <GridItem xs={12} sm={4} md={2} className={classes.bordered}>
                <img src={legenda_azul} alt='Legenda agua'></img>
                <img
                  src={water_on}
                  style={{ height: '5vh' }}
                  alt='Legenda agua'
                ></img>
                <h4>Com Agua</h4>
              </GridItem>

              <GridItem xs={12} sm={4} md={2} className={classes.bordered}>
                <img src={legenda_marrom} alt='Legenda agua desligada'></img>
                <img
                  src={water_off}
                  style={{ height: '5vh' }}
                  alt='Legenda agua desligada'
                ></img>
                <h4>Sem Agua</h4>
              </GridItem>

              <GridItem xs={12} sm={4} md={2} className={classes.bordered}>
                <img src={legenda_cinza} alt='Legenda desligado'></img>
                <h4
                  style={{ display: 'inline-block', height: '5vh' }}
                  alt='Legenda desligado'
                >
                  Desligado
                </h4>
              </GridItem>

              <GridItem xs={12} sm={4} md={2} className={classes.bordered}>
                <img src={legenda_vermelho} alt='Legenda desconectado'></img>
                <h4
                  style={{ display: 'inline-block', height: '5vh' }}
                  alt='Legenda desconectado'
                >
                  Pivô Desligado ou sem conexão!
                </h4>
              </GridItem>
            </GridContainer>
          </CardActions>

          {/* <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <div style={{ display: 'flex' }}>
                            <Button onClick={this.handleConfirmClick} round color='primary' style={{ marginLeft: 'auto', color: 'white' }}><Done />Confirmar</Button>
                            <Button onClick={this.handleCancelClick} round color='danger' style={{ color: 'white', marginLeft: '20px' }}><Cancel />Cancelar</Button>
                        </div>
                    </CardContent>
                </Collapse> */}
        </CardBody>
      </Card >
    );
  }

  decidirBotoes() {
    if (status !== undefined) {

      this.setState({
        percent: status.percent,
        inputPercent: status.percent
      })

      if (status.on_off === 1) {
        this.setOn(true);
        this.setState({ isTurnedOff: false });
      } else if (status.on_off === 2) {
        this.setOn(false);
        this.setState({ isTurnedOff: true });
      }
      if (status.front_back === 3) this.setFront(true);
      else if (status.front_back === 4) this.setFront(false);

      if (status.water === 5) this.setWater(false);
      else if (status.water === 6) this.setWater(true);
    }
  }



  setOn(on) {
    this.setState({ on });
  }

  setFront(front) {
    this.setState({ front });
  }

  setWater(water) {
    this.setState({ water });
  }

  setExpanded(expanded) {
    this.setState({ expanded });
  }

  setHasDecided(hasDecided) {
    this.setState({ hasDecided });
  }

  expand = () => {
    if (!this.state.hasDecided) this.setExpanded(true);
  };

  handleConfirmClick = () => {
    var codigo = [];
    var canUpdate = true;

    if (this.state.front) {
      codigo[0] = 3;
    } else {
      codigo[0] = 4;
    }

    if (this.state.on) {
      codigo[2] = 1;
      this.setState({ isTurnedOff: false });
    } else {
      codigo[2] = 2;
      this.setWater(false)
      this.setState({ isTurnedOff: true });
    }

    if (this.state.water) {
      codigo[1] = 6;
    } else {
      codigo[1] = 5;
    }

    var percentTratado = this.state.inputPercent
    if (percentTratado === 100) percentTratado = 99;
    if (percentTratado === 0) percentTratado = '00';

    codigo[3] = percentTratado.toString();

    if (canUpdate) {
      axios.patch(`${hostname}/intencoes/${this.modulo_id}`, {
        on_off: codigo[2],
        front_back: codigo[0],
        water: codigo[1],
        percent: codigo[3],
      });
      this.setHasDecided(false);
      this.setExpanded(false);
    }
  };

  decidePercentValue = (oldValue) => {
    var newValue = oldValue;

    console.log('aeporraa')
    console.log(newValue)
    if (newValue > 100) {

      newValue = 100;
    }
    else if (newValue < 0) {

      newValue = 0;
    }

    console.log(newValue)
    return newValue
  }

  handlePercentChange = (valueAsNumber) => {
    this.expand()
    valueAsNumber = valueAsNumber.replace(/[^\d]/g, '');

    this.setState({ inputPercent: this.decidePercentValue(valueAsNumber) })
  }

  handlePercentClick = (option) => {
    this.expand()
    if (option === 0) {
      this.setState({ inputPercent: this.decidePercentValue(this.state.inputPercent - 5) })
    } else if (option === 1) {
      this.setState({ inputPercent: this.decidePercentValue(this.state.inputPercent + 5) })
    }
  }

  handleCancelClick = () => {
    this.decidirBotoes();
    this.setHasDecided(false);
    this.setExpanded(false);
  };

  handlePlayClick = () => {
    this.expand();
    this.setOn(true);
  };

  handleStopClick = () => {
    this.expand();
    this.setOn(false);
  };

  handleWaterOnClick = () => {
    this.expand();
    this.setWater(true);
  };

  handleWaterOffClick = () => {
    this.expand();
    this.setWater(false);
  };

  handleRotateLeftClick = () => {
    this.expand();

    if (this.state.isTurnedOff) this.setFront(false);
    else
      alert(
        'Favor, desligar o pivô e clicar em confirmar antes de mudar o sentido'
      );
  };

  handleRotateRightClick = () => {
    this.expand();
    if (this.state.isTurnedOff) this.setFront(true);
    else
      alert(
        'Favor, desligar o pivô e clicar em confirmar antes de mudar o sentido'
      );
  };
}

CardStatus.propTypes = {
  classes: PropTypes.object
};

export default withStyles(cardStatusStyle)(CardStatus);
