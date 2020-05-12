import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Sidebar from './shared/Sidebar'
import ListAgent from './pages/ListAgent'
import Login from './pages/Login'
import ListVehicles from './pages/ListVehicles'
import ListHotels from './pages/ListHotels'

import Planning from './pages/Planning'
import EditPwd from './pages/EditPwd'
import SecretRoute from './shared/SecretRoute'

import './scss/App.scss'

function App() {
  let HideSidebar = window.location.pathname === '/login' ? null : <Sidebar />

  let contentHidebar = window.location.pathname === '/login' ? 'content-login' : 'content'
  return (
    <div id="App">
      <Router>
        {HideSidebar}
        <div className={contentHidebar}>
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
              <Planning />
            </SecretRoute>
            <SecretRoute path="/agents">
              <ListAgent />
            </SecretRoute>
            <SecretRoute path="/" exact>
              <ListHotels />
            </SecretRoute>
          </Switch>
        </div>
      </Router>

    </div>
  )
}

export default App
