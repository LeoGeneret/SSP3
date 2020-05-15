import React from 'react'
import './scss/App.scss'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Sidebar from './shared/Sidebar'
import ListAgent from './pages/ListAgent'
import Login from './pages/Login'
import ListVehicles from './pages/ListVehicles'
import ListHotels from './pages/ListHotels'

import Planning from './pages/Planning'
import EditPwd from './pages/EditPwd'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

function App () {

  // snackbar const
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    type: '',
  });
  
  const openSnackBar = (message, type) => {
    setSnackbar({
      open: true,
      message,
      type,
    })
  }


  const handleClick = (message) => () => {
    //setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleClose = (event, reason) => {
    setSnackbar ({
      ...snackbar,
      open: false,
    })
  };

  const handleExited = () => {
  };

  const classes = useStyles();


  return (
    <div id="App">
      <Router>
        <Sidebar />
        <div className="content">
          
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={snackbar.open}
            autoHideDuration={2000}
            onClose={handleClose}
            onExited={handleExited}
          >
            <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity= {snackbar.type}>
              {snackbar.message}
            </MuiAlert>
          </Snackbar>

          <Switch>
            {/* <Route path="/login">
              <Login />
            </Route> */}
            <Route path="/EditPwd">
              <EditPwd />
            </Route>
            {/* <Route path="/hotels">
              <ListHotels />
            </Route> */}
            <Route path="/vehicles">
              <ListVehicles />
            </Route>
            <Route path="/planning">
              <Planning openSnackBar={openSnackBar} />
            </Route>
            <Route path="/agents">
              <ListAgent openSnackBar={openSnackBar} />
            </Route>
            <Route path="/" exact>
              <ListHotels openSnackBar={openSnackBar} />
            </Route>
          </Switch>


        </div>
      </Router>

    </div>
  )
}

export default App
//export {App(handleClick)}
