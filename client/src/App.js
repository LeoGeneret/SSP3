import React from 'react'
import './scss/App.scss'
// import './scss/_snackbar.scss'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Sidebar from './shared/Sidebar'
import ListAgent from './pages/ListAgent'
import Login from './pages/Login'
import ListVehicles from './pages/ListVehicles'
import ListHotels from './pages/ListHotels'

import Planning from './pages/Planning'
import EditPwd from './pages/EditPwd'

import Snackbar from '@material-ui/core/Snackbar'

import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ErrorIcon from '@material-ui/icons/Error';

import SnackbarApp from './pages/SnackBarApp'

function App () {

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


  const snackStyle = ({
    component : {display: 'flex', width: '373px', height: '57px', justifyContent: 'flex-start', alignItems: 'center'},
    title : {marginBottom: '10px'}
  });
  
  return (
    <div id="App">
      <Router>
        <Sidebar />
        <div className="content">
          
          <SnackbarApp message={snackbar.message} type={snackbar.type} open={snackbar.open} handleClose={snackbar.handleClose} />

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
