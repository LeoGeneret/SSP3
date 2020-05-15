import React from 'react'
import './scss/App.scss'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Sidebar from './shared/Sidebar'
import ListAgent from './pages/ListAgent'
import ListVehicles from './pages/ListVehicles'
import ListHotels from './pages/ListHotels'

import Planning from './pages/Planning'
import EditPwd from './pages/EditPwd'

function App () {
  return (
    <div id="App">
      <Router>
        <Sidebar />
        <div className="content">
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
              <Planning />
            </Route>
            <Route path="/agents">
              <ListAgent />
            </Route>
            <Route path="/" exact>
              <ListHotels />
            </Route>
          </Switch>
        </div>
      </Router>

    </div>
  )
}

export default App
