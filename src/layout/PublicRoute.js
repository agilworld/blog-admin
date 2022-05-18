import React, {useState} from "react"
import { Route, Redirect } from "react-router-dom"
import { useHistory } from "react-router-dom"
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    toolbar: {
        paddingRight: 24// keep right padding when drawer closed
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto'
    },
    appBarSpacer: theme.mixins.toolbar,
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
}))

const PublicRoute = ({ component: Component, ...rest }) => {
    const classes = useStyles()
    const history = useHistory()
    const [open, setOpen] = useState(true);

    return (<Route {...rest}
        render={props => <main><Container maxWidth="xl" className={classes.container}>
            <Component {...props} />
        </Container></main>}
    />)
}


export default PublicRoute
