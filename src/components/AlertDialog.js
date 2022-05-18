import React, { useState } from 'react';
import {connect } from "react-redux"
import PropTypes from "prop-types"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = (props) => {
  const [open, setOpen] = useState(props.open);

  const handleClose = () => {
    setOpen(false);
    props.handleClose()
  };

  const handleOk = () => {
    if( props.handleOk() ) {
        props.handleOk().then(res=>{
            setOpen(false);
        })
    }
    
  };

  return (<Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.desc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk} color="error">
            {props.okButtonText}
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            {props.noButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    
  );
}

AlertDialog.propTypes = {
    triggerText:PropTypes.string,
    title:PropTypes.string,
    desc:PropTypes.string,
    okButtonText:PropTypes.string,
    noButtonText:PropTypes.string,
    handleOk:PropTypes.func
}

AlertDialog.defaultProps = {
    triggerText:"",
    title:"Are you sure want to remove?",
    desc:'',
    okButtonText:'Yes',
    noButtonText:'No',
    handleOk:null
}

export default AlertDialog