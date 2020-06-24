import { container } from "assets/jss/material-kit-react.jsx";
import {
  primaryColor,
  onColor,
  offColor,
  waterOnColor,
  waterOffColor,
  frontBackColor
} from "assets/jss/material-kit-react.jsx";
import PopupAgendamentos from "views/components/PopupAgendamentos";

/* import { InsertLinkOutlined } from "@material-ui/icons"; */

const popupAgendamentoStyle = {
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
  rafael: {
    fontSize: '40px',
    color: 'red'
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
    marginBottom: "15px",
    height: '10%'
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
  },
  popup_container: {
    height: '100%'
  },
  header: {
    textAlign: 'center',
    height: '10%'
  },
  agendamentos: {
    height: '50vh'
  },
  footer: {
    height: '10%'
  },
  acoes: {
    display: 'flex',
    justifyContent: 'space-between'
  }
};

export default popupAgendamentoStyle;