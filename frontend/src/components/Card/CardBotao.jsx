import React from "react";
// nodejs library that concatenates classes
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

// core components
import cardStyleBotao from "assets/jss/material-kit-react/components/cardStyleBotao.jsx";

function CardBotao({ ...props }) {
  const {children} = props;
  // const cardClasses = classNames({
  //   [classes.card]: true,
  //   [classes.cardPlain]: plain,
  //   [classes.cardCarousel]: carousel,
  //   [className]: className !== undefined
  // });
  return(
    <Card style={{ margin: '7px', padding: '2px', width: 'auto', display: 'inline-block',flexDirection: "column" }}>
        <CardBody style={{ margin: '2px', padding: '0px', textAlign: 'center'}}>
        {children}
        </CardBody>
    </Card>
)
}

CardBotao.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  plain: PropTypes.bool,
  carousel: PropTypes.bool,
  children: PropTypes.node
};

export default withStyles(cardStyleBotao)(CardBotao);
