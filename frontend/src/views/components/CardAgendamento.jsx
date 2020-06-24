import React from 'react'
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";

import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import { red } from "@material-ui/core/colors";


import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import water_on from "assets/img/water_on.png";
import water_off from "assets/img/water_off.png";
import rotate_left from "assets/img/rotate_left_small.png";
import rotate_right from "assets/img/rotate_right_small.png";

const useStyles = makeStyles(theme => ({
    card: {
        border: '1px solid black',
        marginBottom: '20px'
    },
    actionButtons: {
        marginLeft: "auto",
    },
    avatar: {
        backgroundColor: red[500]
    },
    open: {
        color: 'green'
    },
    closed: {
        color: 'blue'
    },
    delete: {
        color: 'red'
    }
}));

function CardAgendamento(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        const horaLigar = document.getElementById('timeLigar')
        const horaDesligar = document.getElementById('timeDesligar')

        if (expanded) { // Se estiver clicando em confirmar...
            console.log(horaLigar.value)
        }


        setExpanded(!expanded);
    };

    const handleDeleteClick = () => {

    }

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="pivo" className={classes.avatar}>
                        Pivô
                    </Avatar>
                }
                title="Ligar: 23:00"
                subheader="Desligar: 05:00"
            />
            <CardActions>
                <img width='30vw' src={rotate_right}></img>
                <img width='30vw' src={water_on}></img>

                <IconButton
                    className={classes.actionButtons}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <Button className={expanded ? classes.open : classes.closed}>{expanded ? "Confirmar" : "Mudar"}</Button>
                </IconButton>

                <IconButton
                    onClick={handleDeleteClick}>
                    <Button className={classes.delete}>Deletar</Button>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent style={{ textAlign: 'center' }}>
                    <GridContainer>
                        <GridItem xs={6} sm={6} xs={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} xs={12}>
                                    <h4>Ligar:</h4>
                                </GridItem>
                                <GridItem xs={12} sm={12} xs={12}>
                                    <form>
                                        <input type='time' id='timeLigar' value="22:00"></input>
                                    </form>
                                </GridItem>
                            </GridContainer>
                        </GridItem>

                        <GridItem xs={6} sm={6} xs={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} xs={12}>
                                    <h4>Desligar:</h4>
                                </GridItem>
                                <GridItem xs={12} sm={12} xs={12}>
                                    <form>
                                        <input type='time' id='timeDesligar'></input>
                                    </form>
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                    </GridContainer>

                    <GridContainer>

                        <GridItem xs={6} sm={6} xs={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} xs={12}>
                                    <h4>Sentido:</h4>
                                </GridItem>
                                <GridItem xs={6} sm={6} xs={6}>
                                    <img width='30vw' src={rotate_left}></img>
                                </GridItem>

                                <GridItem xs={6} sm={6} xs={6}>
                                    <img width='30vw' src={rotate_right}></img>
                                </GridItem>
                            </GridContainer>
                        </GridItem>

                        <GridItem xs={6} sm={6} xs={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} xs={12}>
                                    <h4>Agua:</h4>
                                </GridItem>
                                <GridItem xs={6} sm={6} xs={6}>
                                    <img width='30vw' src={water_on}></img>
                                </GridItem>

                                <GridItem xs={6} sm={6} xs={6}>
                                    <img width='30vw' src={water_off}></img>
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                    </GridContainer>
                </CardContent>
            </Collapse>
        </Card>
    );

    /* return (
<Card style={{ border: '1px solid black' }}>
        <CardHeader className={classes.cardHeader}>
            <h3>{props.hora}</h3>
            <h5>{props.on_off}</h5>
        </CardHeader>
        <CardBody>
            <div>
                <GridContainer style={{ justify: 'center' }}>
                    <GridItem xs={10} sm={5} md={3}>
                        <img width='20%' src={props.front_back}></img>
                    </GridItem>
                    <GridItem xs={10} sm={5} md={3}>
                        <img width='20%' src={props.water}></img>
                    </GridItem>
                    <GridItem xs={10} sm={5} md={3}>
                        <Button color="danger">Deletar</Button>
                    </GridItem>
                    <GridItem xs={10} sm={5} md={3}>
                        <Button color='success'>Mudar</Button>
                    </GridItem>
                </GridContainer>
            </div>
        </CardBody>
    </Card>
    ) */
}

// export default withStyles(cardAgendamentoStyle)(CardAgendamento)
export default CardAgendamento