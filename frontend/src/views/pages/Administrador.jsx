
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";


// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Lista from '../components/PageAdministrador/Lista'

import administradorPageStyle from "assets/jss/material-kit-react/views/administradorPageStyle.jsx";

import { store } from 'react-notifications-component';

import image from "assets/img/pivo.png";
import openSocket from 'socket.io-client'

let socket

var hostname

class Administrador extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fazendas: [],
            pivos: [],
            usuarios: [],
            status_pivos: [],
            intencoes: []
        }

        this.keys = [
            ['usuario_id', 'login', 'senha', 'tipo_user'],
            ['fazenda_id', 'telefone', 'propriedade', 'cidade', 'concentrador_ip', 'latitude_fazenda', 'longitude_fazenda', 'usuario_id'],
            ['modulo_id', 'pivo_name', 'map_x', 'map_y', 'radius', 'start_angle', 'end_angle',
                'counter_clockwise', 'latitude_pivo', 'longitude_pivo', 'fazenda_id']
        ]
    }

    componentDidMount() {
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

        socket.on('update_fazendas', payload => {

            let type
            if (payload.error) {
                type = 'danger'
            } else {
                type = 'success'
            }

            store.addNotification({
                title: "Mensagem!",
                message: payload.msg,
                type: type,
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

        fetch(`${hostname}/fazendas`)
            .then(res => res.json())
            .then(res => this.setState({ fazendas: res }))

        fetch(`${hostname}/pivos`)
            .then(res => res.json())
            .then(res => this.setState({ pivos: res }))

        fetch(`${hostname}/usuarios`)
            .then(res => res.json())
            .then(res => this.setState({ usuarios: res }))
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
                    }}>
                    <div className={classes.container}>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={10} md={8}>
                                <Card style={{ marginBottom: '50px' }}>
                                    <CardHeader color="primary" style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }} className={classes.cardHeader}>Usuario</CardHeader>
                                    <Lista primary_key='usuario_id' hostname={hostname} keys={this.keys[0]} items={this.state.usuarios} route='usuarios'></Lista>
                                </Card>
                                <Card style={{ marginBottom: '50px' }}>
                                    <CardHeader color="primary" style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }} className={classes.cardHeader}>Fazendas</CardHeader>
                                    <Lista primary_key='fazenda_id' hostname={hostname} keys={this.keys[1]} items={this.state.fazendas} route='fazendas'></Lista>
                                </Card>
                                <Card style={{ marginBottom: '50px' }}>
                                    <CardHeader color="primary" style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }} className={classes.cardHeader}>Pivos</CardHeader>
                                    <Lista primary_key='' hostname={hostname} keys={this.keys[2]} items={this.state.pivos} route='pivos'></Lista>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                </div>
            </div>
        );
    }
}

Administrador.propTypes = {
    classes: PropTypes.object
};

export default withStyles(administradorPageStyle)(Administrador);
