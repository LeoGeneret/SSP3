import React from 'react'
import {useHistory} from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'

import Sidebar from './shared/Sidebar'
import ListAgent from './pages/ListAgent'
import Login from './pages/Login'
import ListHotels from './pages/ListHotels'

import Planning from './pages/Planning'
import SecretRoute from './shared/SecretRoute'




import './scss/App.scss'

function App() {
  
  // router
  const history = useHistory()

  let HideSidebar = history.location.pathname === '/login' ? null : <Sidebar />
  let contentHidebar = history.location.pathname === '/login' ? 'content-login' : 'content'
  
  return (
    <div id="App">
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
    </div>
  )
}

export default App
