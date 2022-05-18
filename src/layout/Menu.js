import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuItems from '../components/menuItems';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      fontSize:'1rem',
      ...theme.mixins.toolbar,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: 240,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }
}));

const Menu = (props) => {
    const classes = useStyles();
    const onLogout = () => {
      props.onLogout()
    }
    return (<Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !props.open && classes.drawerPaperClose),
        }}
        open={props.open}>
            <div className={classes.toolbarIcon}>
              <IconButton onClick={props.handleDrawerClose}>
                  <ChevronLeftIcon />
              </IconButton>
            </div>
        <Divider />
        <List>
            <MenuItems onLogout={onLogout} />
        </List>
    </Drawer>)
}

export default Menu