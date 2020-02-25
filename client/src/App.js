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
import SecretRoute from './shared/SecretRoute'

function App () {
  return (
    <div id="App">
      <Router>
        <Sidebar />
        <div className="content">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            {/* <SecretRoute path="/EditPwd">
              <EditPwd />
            </SecretRoute> */}
            {/* <SecretRoute path="/vehicles">
              <ListVehicles />
            </SecretRoute> */}
            <SecretRoute path="/planning">
                <Planning/>
            </SecretRoute>
            <SecretRoute path="/agents">
                <ListAgent />
            </SecretRoute>
            <SecretRoute path="/" exact>
                <ListHotels/>
            </SecretRoute>
          </Switch>
        </div>
      </Router>

    </div>
  )
}

export default App
