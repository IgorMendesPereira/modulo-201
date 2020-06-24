
import React from "react";
import openSocket from 'socket.io-client'
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import mapaStyle from "assets/jss/material-kit-react/components/mapaStyle";


const queryString = require('query-string')
var hostname
var socket

class Mapa extends React.Component {

    constructor(props) {
        super(props);

        this.draw = this.draw.bind(this)
        this.resolveMouseCoordinates = this.resolveMouseCoordinates.bind(this)

        this.state = {
            pivos: [],
            status_pivos: []
        }
    }

    componentDidMount() {
        this.intervalID = setInterval(this.draw, 100)
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
            .then(res => this.setState({ pivos: res }))

        fetch(`${hostname}/status_pivos/`) //TODO No futuro filtrar por fazenda, como trabalhamos localmente nao 
            .then(res => res.json())
            .then(res => this.setState({ status_pivos: res }))

        socket.on('update_status', (status) => {
            fetch(`${hostname}/status_pivos/`) //TODO No futuro filtrar por fazenda, como trabalhamos localmente nao 
                .then(res => res.json())
                .then(res => {
                    var statusAtuais = res
                    statusAtuais.forEach(statusAtual => {
                        if (statusAtual.modulo_id === status.modulo_id) {
                            statusAtual.on_off = status.on_off
                            statusAtual.front_back = status.front_back
                            statusAtual.water = status.water
                        }
                    })

                    this.setState({ status_pivos: statusAtuais })
                })
        })
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    draw() {
        const canvas = this.refs.mapa
        const ctx = canvas.getContext('2d')
        const img = this.refs.mapImage

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, this.props.width, this.props.height)

        /* ctx.font = '24px serif'
        ctx.fillText('MouseX: ' + this.refs.mouseX, 10, 100)
        ctx.fillText('MouseY: ' + this.refs.mouseY, 10, 120) */

        ctx.lineWidth = 3
        var color = 0;

        if (this.props.push_history) {
            this.state.pivos.forEach(pivo => {
                this.state.status_pivos.forEach(status => {
                    if (status.modulo_id === pivo.modulo_id) {
                        if (status.fail != '0') {
                            color = '255, 0, 0'
                        } else if (status.on_off == '1') {
                            if (status.water == '6') {
                                color = '0, 0, 255'
                            } else {
                                color = '200, 200, 50'
                            }
                        } else {
                            color = '220, 220, 220'
                        }

                        //Desenha o Circulo
                        ctx.beginPath()
                        ctx.strokeStyle = `rgb(${color})`
                        ctx.fillStyle = `rgba(${color}, 0.7)`
                        ctx.arc(pivo.map_x, pivo.map_y, pivo.radius, /* pivo.start_angle * (Math.PI / 180) */ 0, /* pivo.end_angle * (Math.PI / 180) */ 7)
                        ctx.stroke()
                        ctx.fill()

                        //Desenha o traço de sentido
                        ctx.beginPath()
                        ctx.strokeStyle = 'rgb(0,0,0)'
                        ctx.fillStyle = 'rgb(0,0,0)'
                        ctx.moveTo(pivo.map_x, pivo.map_y)
                        ctx.lineTo(pivo.map_x - pivo.radius, pivo.map_y)
                        ctx.stroke()

                        //Desenha o sentido
                        if (status.front_back == '4') {
                            ctx.beginPath()
                            ctx.moveTo(pivo.map_x - pivo.radius, pivo.map_y)
                            ctx.lineTo(pivo.map_x - pivo.radius + 10, pivo.map_y + 15)
                            ctx.lineTo(pivo.map_x - pivo.radius + 20, pivo.map_y)
                            ctx.fill()
                        } else if (status.front_back == '3') {
                            ctx.beginPath()
                            ctx.moveTo(pivo.map_x - pivo.radius, pivo.map_y)
                            ctx.lineTo(pivo.map_x - pivo.radius + 10, pivo.map_y - 15)
                            ctx.lineTo(pivo.map_x - pivo.radius + 20, pivo.map_y)
                            ctx.fill()
                        }
                    }
                })
            })
        } else {
            this.state.pivos.forEach(pivo => {
                this.state.status_pivos.forEach(status => {
                    if (pivo.modulo_id === status.modulo_id) {
                        if (pivo.modulo_id === this.modulo_id) {

                            if (status.fail != '0') {
                                color = '255, 0, 0'
                            } else if (status.on_off == '1') {
                                if (status.water == '6') {
                                    color = '0, 0, 255'
                                } else {
                                    color = '200, 200, 50'
                                }
                            } else {
                                color = '220, 220, 220'
                            }

                            //Desenha o Circulo
                            ctx.beginPath()
                            ctx.strokeStyle = `rgb(${color})`
                            ctx.fillStyle = `rgba(${color}, 0.7)`
                            ctx.arc(this.props.map_x, this.props.map_y, this.props.radius, /* pivo.start_angle * (Math.PI / 180) */ 0, /* pivo.end_angle * (Math.PI / 180) */ 7)
                            ctx.stroke()
                            ctx.fill()

                            //Desenha o traço de sentido
                            ctx.beginPath()
                            ctx.strokeStyle = 'rgb(0,0,0)'
                            ctx.fillStyle = 'rgb(0,0,0)'
                            ctx.moveTo(this.props.map_x, this.props.map_y)
                            ctx.lineTo(this.props.map_x - this.props.radius, this.props.map_y)
                            ctx.stroke()

                            //Desenha o sentido
                            if (status.front_back == '4') {
                                ctx.beginPath()
                                ctx.moveTo(this.props.map_x - this.props.radius, this.props.map_y)
                                ctx.lineTo(this.props.map_x - this.props.radius + 10, this.props.map_y + 15)
                                ctx.lineTo(this.props.map_x - this.props.radius + 20, this.props.map_y)
                                ctx.fill()
                            } else if (status.front_back == '3') {
                                ctx.beginPath()
                                ctx.moveTo(this.props.map_x - this.props.radius, this.props.map_y)
                                ctx.lineTo(this.props.map_x - this.props.radius + 10, this.props.map_y - 15)
                                ctx.lineTo(this.props.map_x - this.props.radius + 20, this.props.map_y)
                                ctx.fill()
                            }
                        }
                    }
                })
            })
        }
    }

    handleClick(evt) {
        const mousePos = this.resolveMouseCoordinates(evt.clientX, evt.clientY)
        const xP = mousePos.x
        const yP = mousePos.y

        this.state.pivos.forEach((pivo) => {
            const xC = pivo.map_x
            const yC = pivo.map_y
            const r = pivo.radius

            const d = Math.pow(Math.pow(xP - xC, 2) + Math.pow(yP - yC, 2), 1 / 2)

            if (this.props.push_history) {
                if (d <= r) {
                    this.props.history.push(`/s?modulo_id=${pivo.modulo_id}&fazenda_id=${pivo.fazenda_id}&usuario_id=${this.usuario_id}`)
                }
            }
        })
    }

    getMousePos(evt) {
        const mousePos = this.resolveMouseCoordinates(evt.clientX, evt.clientY)
        this.refs.mouseX = mousePos.x
        this.refs.mouseY = mousePos.y
    }

    resolveMouseCoordinates(mouseX, mouseY) {
        const canvas = this.refs.mapa
        var rect = canvas.getBoundingClientRect()

        var widthRatio = this.props.height / rect.height
        var heightRatio = this.props.width / rect.width

        return {
            x: (mouseX - rect.left) * widthRatio,
            y: (mouseY - rect.top) * heightRatio
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <canvas className={classes.map} width={this.props.width} height={this.props.height} ref="mapa" onMouseMove={(e) => this.getMousePos(e)} onClick={(e) => this.handleClick(e)} />
                <img className={classes.mapImage} ref="mapImage" src={this.props.image} alt='Imagem de cima de uma fazenda' />
            </div>
        );
    }
}

Mapa.propTypes = {
    classes: PropTypes.object
};

export default withStyles(mapaStyle)(Mapa);