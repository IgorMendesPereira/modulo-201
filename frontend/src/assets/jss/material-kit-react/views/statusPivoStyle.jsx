import { container } from "assets/jss/material-kit-react.jsx";
/* import { InsertLinkOutlined } from "@material-ui/icons"; */

const fazendaStyle = {
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
    width: '20vh',
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