const cardStatusStyle = {
    card: {
        marginBottom: '20px'
    },
    cardActions: {
        borderTop: '1px solid grey'
    },
    cardContentButtons: {
        display: 'block'
    },
    actionButtons: {
        width: '400px'
    },
    imagemMapa: {
        borderRadius: '1px',
        width: '100%'
    },
    open: {
        color: 'green'
    },
    closed: {
        color: 'blue'
    },
    delete: {
        color: 'red'
    },
    bordered: {
        paddingLeft: '20px'
    },
    neutral: {
        transition: 'all .3s ease-in-out',
        transform: 'scale(1)',
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
    appear: {
        transition: 'all .3s ease-in-out',
        opacity: '1',
        display: 'inline-block'
    },
    disappear: {
        transition: 'all .3s ease-in-out',
        opacity: '0',
        display: 'none'
    },
    bolded: {
        fontWeight: 'bold'
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
    }
}

export default cardStatusStyle;