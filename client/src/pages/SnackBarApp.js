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

function SnackbarApp () {

  // snackbar default
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    type: '',
  });
  
  // Open the snackbar
  const openSnackBar = (message, type) => {
    setSnackbar({
      open: true,
      message,
      type,
    })
  }

  // Close the snackbar
  const handleClose = (event, reason) => {
    setSnackbar ({
      ...snackbar,
      open: false,
    })
  };

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
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleClose}
        severity={snackbar.type}
        message={snackbar.message}
        classes={{
        root: classes.root,
        }}

    >
        {(() => {
        if (snackbar.type=='success') {
            return (
            <div style={snackStyle.component}>
                <CheckCircleIcon classes={{
                root: classes.iconCheck,
                }}/>
                <div>
                <h4 style={snackStyle.title}>Terminé !</h4>
                <p>{snackbar.message}</p>
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
                <p>{snackbar.message}</p>
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