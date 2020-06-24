import React from 'react'

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import cardHistoricoStyle from "assets/jss/material-kit-react/components/cardHistoricoStyle.jsx";
import withStyles from "@material-ui/core/styles/withStyles";


function CardHistorico(props) {
    const { classes } = props

    return (
        <Card>
            <CardHeader className={classes.cardHeader}>
                <h3>{props.date}</h3>
                <h2>{props.on_off}</h2>
            </CardHeader>
            <CardBody>
                <div>
                    <GridContainer className={classes.cardContainer}>
                        {props.front_back != 0 ? <GridItem xs={10} sm={6} md={4} className={classes.items}>
                            <h5>Sentido</h5>
                            <img width='30%' src={props.front_back} alt='Sentido'></img>
                        </GridItem> : null}
                        <GridItem xs={10} sm={6} md={4} className={classes.items}>
                            <h5>Agua:</h5>
                            <img width='30%' src={props.water} alt='Agua'></img>
                        </GridItem>
                        <GridItem xs={10} sm={12} md={4} className={classes.items}>
                            <h5>Percentímetro:</h5>
                            <p>{props.percent}</p>
                        </GridItem>
                        <GridItem xs={10} sm={6} md={4} className={classes.items}>
                            <h5>Voltagem:</h5>
                            <p>{props.volt}</p>
                        </GridItem>
                        <GridItem xs={10} sm={6} md={4} className={classes.items}>
                            <h5>Pressão:</h5>
                            <p>{props.pressure}</p>
                        </GridItem>
                    </GridContainer>
                </div>
            </CardBody>
        </Card>
    )
}

export default withStyles(cardHistoricoStyle)(CardHistorico)