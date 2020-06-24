import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import openSocket from 'socket.io-client'
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import agendamentoStyle from "assets/jss/material-kit-react/views/agendamentoStyle.jsx";

import { Link } from "react-router-dom";
import { store } from 'react-notifications-component';

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";

import Button from "components/CustomButtons/Button.jsx";

import water_on from 'assets/img/water_on.png';
import water_off from 'assets/img/water_off.png';
import rotate_left from 'assets/img/rotate_left_small.png';
import rotate_right from 'assets/img/rotate_right_small.png';
import pivo from 'assets/img/cardStatus/pivo.jpeg';
import stop from 'assets/img/cardStatus/stop.png';
import play from 'assets/img/cardStatus/play.png';

import CardStatus from '../components/CardStatus'

import Calendar from 'react-calendar';

import image from "assets/img/pivo.png";
import Arrow from "@material-ui/icons/ArrowBack";
import History from "@material-ui/icons/History"

import CardAgendamento from '../components/CardAgendamento'

var hostname
var socket
const queryString = require('query-string')

class Agendamentos extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            date: new Date(),
            agenda: {
                open: false,
                date: null
            },
            pivos: [],
            time_stamp: 'carregando..'
        };

        this.handleDayClick = this.handleDayClick.bind(this)
    }

    componentDidMount() {
        this.fazenda_id = queryString.parse(this.props.location.search).fazenda_id
        this.modulo_id = queryString.parse(this.props.location.search).modulo_id
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
            .then(res => this.setState({ pivos: res },
                this.setState({
                    pivo_name: res.filter((pivo) => {
                        return pivo.modulo_id === this.modulo_id;
                    })[0].pivo_name,

                    time_stamp: res.filter((pivo) => {
                        return pivo.modulo_id === this.modulo_id;
                    })[0].time_stamp
                })
            ))

        fetch(`${hostname}/status_pivos/`) //TODO No futuro filtrar por fazenda, como trabalhamos localmente nao 
            .then(res => res.json())
            .then(res => this.setState({ status_pivos: res }, console.log(res)))

        socket.on('update_status', (status) => {
            this.setState({ status_pivos: status })
            if (status.modulo_id === this.modulo_id) {
                this.setState({ time_stamp: status.time_stamp })
            }
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

        // Animaçãozinha de aparecer os agendamentos
        setTimeout(
            function () {
                this.setState({ cardAnimaton: "" });
            }.bind(this), 700);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
        socket.close()
    }

    handleDayClick(date) {
        const data = `${date.toLocaleString('default', { day: 'numeric' })} ${date.toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase()}${date.toLocaleString('default', { month: 'long' }).slice(1)} de ${date.toLocaleString('default', { year: 'numeric' })}`
        this.setState({
            agenda: {
                date: data
            }
        })
    }

    render() {
        const { classes } = this.props
        return (
            <div
                className={classes.pageHeader}
                style={{
                    backgroundImage: "url(" + image + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "top center"
                }}
            >
                <div className={classes.container}>
                    <GridContainer>

                        <Card className={classes[this.state.cardAnimaton]}>

                            <CardHeader color="primary" className={classes.cardHeader}>


                                <h4>Pivô {this.state.pivo_name} - Atualizado a ultima vez: {this.state.time_stamp}</h4>


                            </CardHeader>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                                    <Link to={`/p?fazenda_id=${this.fazenda_id}&usuario_id=${this.usuario_id}`} className={classes.link}>
                                        <Button round color="primary" size="lg">
                                            <Arrow className={classes.inputIconsColor} /> Mapa
                                        </Button>
                                    </Link>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
                                    <Link to={`/h?modulo_id=${this.modulo_id}&fazenda_id=${this.fazenda_id}&usuario_id=${this.usuario_id}`} className={classes.link}>
                                        <Button round color="facebook" size="lg" >
                                            <History className={classes.inputIconsColor} />  histórico
                                        </Button>
                                    </Link>
                                </GridItem>
                            </GridContainer>

                            <CardBody>
                                <CardStatus
                                    pivos={this.state.pivos}
                                    status_pivos={this.state.status_pivos}
                                    location={this.props.location} />
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'center' }}>

                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                        </Card>
                    </GridContainer>
                </div>
            </div >
        )
    }
}

Agendamentos.propTypes = {
    classes: PropTypes.object
};

export default withStyles(agendamentoStyle)(Agendamentos);
