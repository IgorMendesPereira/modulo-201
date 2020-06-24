import { container } from "assets/jss/material-kit-react.jsx";
import {
  primaryColor,
  onColor,
  offColor,
  waterOnColor,
  waterOffColor,
  frontBackColor
} from "assets/jss/material-kit-react.jsx";

/* import { InsertLinkOutlined } from "@material-ui/icons"; */

const fazendaStyle = {
  header: {
    textAlign: 'center',
    fontSize: '100%',
    paddingTop: '20px'
  },
  switchBaseOnOff: {
    color: primaryColor + "!important"
  },
  switchIconOnOff: {
    boxShadow: "0 1px 3px 1px rgba(0, 0, 0, 0.4)",
    color: "#FFFFFF !important",
    border: "1px solid " + offColor
  },
  switchBarOnOff: {
    width: "30px",
    height: "15px",
    backgroundColor: offColor,
    borderRadius: "15px",
    opacity: "0.7!important",
  },
  switchCheckedOnOff: {
    "& + $switchBarOnOff": {
      backgroundColor: onColor + " !important"
    },
    "& $switchIconOnOff": {
      borderColor: onColor
    }
  },
  switchBaseWaterOnOff: {
    color: primaryColor + "!important"
  },
  switchIconWaterOnOff: {
    boxShadow: "0 1px 3px 1px rgba(0, 0, 0, 0.4)",
    color: "#FFFFFF !important",
    border: "1px solid " + waterOffColor
  },
  switchBarWaterOnOff: {
    width: "30px",
    height: "15px",
    backgroundColor: waterOffColor,
    borderRadius: "15px",
    opacity: "0.7!important"
  },
  switchCheckedWaterOnOff: {
    "& + $switchBarWaterOnOff": {
      backgroundColor: waterOnColor + " !important"
    },
    "& $switchIconWaterOnOff": {
      borderColor: waterOnColor
    }
  },

  switchBaseFrontBack: {
    color: primaryColor + "!important"
  },
  switchIconFrontBack: {
    boxShadow: "0 1px 3px 1px rgba(0, 0, 0, 0.4)",
    color: "#FFFFFF !important",
    border: "1px solid " + frontBackColor
  },
  switchBarFrontBack: {
    width: "30px",
    height: "15px",
    backgroundColor: frontBackColor,
    borderRadius: "15px",
    opacity: "0.7!important"
  },
  switchCheckedFrontBack: {
    "& + $switchBarFrontBack": {
      backgroundColor: frontBackColor + " !important"
    },
    "& $switchIconFrontBack": {
      borderColor: frontBackColor
    }
  },


  status_variable_label: {
    margin: 'auto',
    textAlign: 'center',
  },
  status_label: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  imagemMapa: {
    display: 'none',
    width: "100%",
    height: "100%"
  },
  mapa: {
    display: 'block',
    width: '50%',
    margin: 'auto',
    border: '5px solid black'
  },
  container: {
    ...container,
    zIndex: "2",
    position: "relative",
    paddingTop: "5vh",
    color: "#FFFFFF",
    //paddingBottom: "200px" Renderiza com 200 pixels pra baixo do botão
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  pageHeader: {
    minHeight: "100vh",
    height: "auto",
    display: "inherit",
    position: "relative",
    margin: "0",
    padding: "0",
    border: "0",
    alignItems: "center",
    "&:before": {
      background: "rgba(0, 0, 0, 0.5)" //Fundo escuro 
    },
    "&:before,&:after": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: '""'
    },
    "& footer li a,& footer li a:hover,& footer li a:active": {
      color: "#FFFFFF"
    },
    "& footer": {
      position: "absolute",
      bottom: "0",
      width: "100%"
    }
  },
  gridContainers: {
    display: 'flex',
    alignItems: 'center',
  },
  switch: {
    margin: 'auto'
  },
  form: {
    margin: "0"
  },
  cardHeader: {
    width: "auto",
    textAlign: "center",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "-40px",
    padding: "20px 0",
    marginBottom: "15px"
  },
  divider: {
    marginTop: "30px",
    marginBottom: "0px",
    justifyContent: "space-between",
    textAlign: "left"
  },
  cardFooter: {
    paddingTop: "0rem",
    border: "0",
    borderRadius: "6px",
    justifyContent: "center !important"
  },
  inputIconsColor: {
    color: "#495057"
  }
};

export default fazendaStyle;