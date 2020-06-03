import React from 'react'


import Snackbar from '@material-ui/core/Snackbar'

import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles({
  root: {
    background: 'white',
    borderRadius: 6,
    border: 0,
    color: 'black',
    padding: '10px 20px',
    boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.1)',
    display: 'flex',
  },
  iconCheck: {
    color: '#87D37C',
    marginRight: '20px'
  },
  iconError: {
    color: '#EF3E36',
    marginRight: '20px'
  },
  inconClose: {
    position: 'absolute',
    right: '10px',
    top: '10px',
  }
});

function SnackbarApp (props) {

  const classes = useStyles();

  const snackStyle = ({
    component : {display: 'flex', width: '373px', height: '57px', justifyContent: 'flex-start', alignItems: 'center'},
    title : {marginBottom: '10px'}
  });
  
  return (
    <Snackbar
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
        }}
        open={props.open}
        autoHideDuration={2000}
        onClose={props.handleClose}
        severity={props.type}
        message={props.message}
        classes={{
        root: classes.root,
        }}

    >
        {(() => {
        if (props.type=='success') {
            return (
            <div style={snackStyle.component}>
                <CheckCircleIcon classes={{
                root: classes.iconCheck,
                }}/>
                <div>
                <h4 style={snackStyle.title}>Terminé !</h4>
                <p>{props.message}</p>
                </div>
                <HighlightOffIcon onClick={handleClose} classes={{
                root: classes.inconClose,
                }}/>
                
            </div>
            )
        }
        else {
            return (
            <div style={snackStyle.component}>
                <ErrorIcon classes={{
                root: classes.iconError,
                }}/>
                <div>
                <p>{props.message}</p>
                </div>
                <HighlightOffIcon onClick={handleClose} classes={{
                root: classes.inconClose,
                }}/>
                
            </div>
            )
        }
        })()}

    </Snackbar>
    )
}

export default SnackbarApp