
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import '../../global.css'

import { Link } from "react-router-dom";


import {FiLock } from 'react-icons/fi'
import {FiUser } from 'react-icons/fi'
// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPageStyle.jsx";

import image from "assets/img/pivo.png";
import Axios from 'axios'

import { logando } from "../../services/auth"

const soil = require ('../../assets/img/logo_soil.png')

var hostname

/* const ip = require('../../util/ip'); */


class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      login: '',
      senha: '',
      hidden: true,
      cardAnimaton: "cardHidden"
    };

    const concentrador_id = localStorage.getItem('concentrador_id')
    console.log('CONCENTRADOR', concentrador_id)

    this.handleLoginChange = this.handleLoginChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.toggleShow = this.toggleShow.bind(this);
  }

  handlePasswordChange(e) {
    this.setState({ senha: e.target.value });
  }

  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );

    if (this.props.senha) {
      this.setState({ senha: this.props.senha });
    }

    hostname = window.location.hostname
    if (hostname === '192.168.100.201')
      hostname = 'http://192.168.100.201:3308'
    else if (hostname === 'localhost')
      hostname = 'http://localhost:3308'
    else if (hostname === 'web.soiltech.com.br')
      hostname = 'https://web.soiltech.com.br'
    else if (hostname === 'ec2-35-173-32-138.compute-1.amazonaws.com')
      hostname = 'http://ec2-35-173-32-138.compute-1.amazonaws.com:3308'
  }


  handleSignIn = async e => {
    e.preventDefault();
    const { login, senha } = this.state;
    if (!login || !senha) {
      alert("Preencha e-mail e senha para continuar!");
    } else {
      try {
        const res = await Axios.post(`${hostname}/usuarios/${this.state.login}`, { senha: this.state.senha })
        const response = logando(res.data.token);
        const msg = res.data.mensagem
        const token = res.data.token
        const usuario_id = response.usuario_id
        if (token) {
          console.log(usuario_id)
          this.props.history.push({
            pathname: '/f',
            state: {
              token: token,
              usuario_id: usuario_id
            }
          })

        }
        else if (msg === "Falha na Autenticação") {
          alert("Falha na autenticação")
        }
        else {
          alert("Falha na autenticação")
        };

      } catch (err) {
        this.setState({
          error:
            "Houve um problema com o login, verifique suas credenciais."
        });
      }
    }
  };

  handleLoginChange(event) {
    this.setState({ login: event.target.value })
  }

  handleSenhaChange(event) {
    this.setState({ senha: event.target.value })
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
              <GridItem xs={12} sm={10} md={8}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader  className={classes.cardHeader} >
                      <h4><img src = {soil} style={
                        {width: '150px',
                         height: '130px',}}/>
                         </h4>
                    </CardHeader>
                    <CardBody>
                    <div className="login-container">
                      
                        <form className = "form">
                          <input
                            id='login'
                            value={this.state.nome}
                            onChange={this.handleLoginChange}
                            placeholder="Nome" /> <FiUser/>
                          
                          <input
                            id='senha'
                            value={this.state.nome}
                            onChange={this.handleSenhaChange}
                            type={this.state.hidden ? "password" : "text"}
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            placeholder="Senha" /> <FiLock/>
                        </form>
                      
                    </div>
                          </CardBody>
                          <CardFooter>
                            <Link className="button" 
                            style={{ backgroundColor: 'rgb(162, 166, 56)', color: 'white'}}
                            type = "submit" onClick={this.handleSignIn} >
                                  Entrar 
                            </Link>
                          </CardFooter>
                      
                  
                    

                    {/* <CardBody>
                      <TextField id='login' label='Nome' value={this.state.nome} onChange={this.handleLoginChange}>

                      </TextField>
                      <TextField id='senha' label='Senha' 
                        value={this.state.nome} 
                        onChange={this.handleSenhaChange} 
                        type={this.state.hidden ? "password" : "text"}
                        value={this.state.password}
                        onChange={this.handlePasswordChange}>
                      </TextField>
                    </CardBody> */}
                    {/* <CardFooter className={classes.cardFooter}>
                      <button className = "button" type = "submit" onClick={this.handleSignIn} >
                        Entrar
                      </button>
                    </CardFooter> */}
                  </form>
                </Card>
              </GridItem>
            </GridContainer>

            {/* <img src={logoNevada}  style={{
              width: '150px',
              height: '75px',
              position: 'fixed',
              top: '25px',
              right: '10px'
            }}>
            </img> */}
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(loginPageStyle)(LoginPage);
