import { container } from "assets/jss/material-kit-react.jsx";

const agendamentoStyle = {
  header: {
    textAlign: 'center'
  },
  agendamentos: {
    height: '600px'
  },
  calendar: {
    textAlign: 'center',
    margin: '0 auto',
    width: '100%'
  },
  mapa: {
    display: 'block',
    width: '100%',
    margin: 'auto',
    border: '5px solid black'
  },
  imagemMapa: {
    display: 'none',
    width: "100%",
    height: "100%",
  },
  container: {
    ...container,
    zIndex: "2",
    position: "relative",
    paddingTop: "20vh",
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
  cardHeader: {
    width: "auto",
    textAlign: "center",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "-40px",
    padding: "20px 0",
    marginBottom: "15px"
  },
  '@media (max-width: 600px)': { //Telas menores que 600px
    actionButtons: {
      width: '60px'
    }
  },
  '@media (min-width: 600px)': {
    actionButtons: {
      width: '30px'
    }
  },
  '@media (min-width: 728px)': {
    actionButtons: {
      width: '40px'
    }
  },
  '@media (min-width: 1024px)': {
    actionButtons: {
      width: '60px'
    }
  },
  selected: {
    transition: 'all .3s ease-in-out',
    transform: 'scale(1.2)',
    backgroundColor: 'green'
  },
  disselected: {
    transition: 'all .3s ease-in-out',
    transform: 'scale(0.8)',
    backgroundColor: 'grey'
  },
};

export default agendamentoStyle;