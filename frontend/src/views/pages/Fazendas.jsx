
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import { Link } from "react-router-dom";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import '../../global.css'


import fazendaStyle from "assets/jss/material-kit-react/views/fazendaStyle.jsx";

import image from "assets/img/pivo.png";


var hostname

var usuario_id


//const ip = require('../../util/ip');

class Fazendas extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      fazendas: []
    };
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );

    usuario_id = this.props.location.state.usuario_id

    hostname = window.location.hostname
    if (hostname === '192.168.100.201')
      hostname = 'http://192.168.100.201:3308'
    else if (hostname === 'localhost')
      hostname = 'http://localhost:3308'
    else if (hostname === 'web.soiltech.com.br')
      hostname = 'https://web.soiltech.com.br'
    else if (hostname === 'ec2-35-173-32-138.compute-1.amazonaws.com')
      hostname = 'http://ec2-35-173-32-138.compute-1.amazonaws.com:3308'


    fetch(`${hostname}/fazendas/${usuario_id}`)
      .then(res => res.json())
      .then(res => this.setState({ fazendas: res }))
  }

  componentWillUnmount() {

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
                    <CardHeader style={{ backgroundColor: 'white', border: '1px solid black' }} className={classes.cardHeader}>
                      <h3 style={{ fontWeight: 'bold' }}>Fazendas</h3>
                    </CardHeader>
                    <CardBody >
                      {this.state.fazendas.map(fazenda => (
                        <div key={fazenda.fazenda_id}>
                          <Link style={{ backgroundColor: 'rgb(162, 166, 56)'}} to={`/p?fazenda_id=${fazenda.fazenda_id}&usuario_id=${usuario_id}`} className={classes.link}>
                            <Card>
                              <CardBody style={{ backgroundColor: 'rgb(162, 166, 56)', color: 'white', borderRadius: '6px' }}>
                                <GridContainer  className="button" style={{ textAlign: 'center' }}>
                                  <GridItem  xs={12} sm={6} md={6}>
                                    <h4 className={classes.cardtitle}> Fazenda: {fazenda.propriedade} </h4>
                                    <h4 className={classes.cardtitle}> Cidade: {fazenda.cidade} </h4>
                                  </GridItem>
                                  <GridItem xs={12} sm={6} md={6}>
                                    <h6>Entrar</h6>
                                  </GridItem>
                                </GridContainer>
                              </CardBody>
                            </Card>
                          </Link>
                        </div>
                      ))}
                    </CardBody>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

Fazendas.propTypes = {
  classes: PropTypes.object
};

export default withStyles(fazendaStyle)(Fazendas);
