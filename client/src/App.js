
// Libs
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// Shared
import Sidebar from './shared/Sidebar'
import ListAgent from './pages/ListAgent'

// Pages
import Login from './pages/Login'
import ListVehicles from './pages/ListVehicles'
import ListHotels from './pages/ListHotels'
import Planning from './pages/Planning'
import EditPwd from './pages/EditPwd'
import PageFormAgent from './pages/PageFormAgent'
import PageFormHotel from './pages/PageFormHotel'
import PageFormVisite from './pages/PageFormVisite'

// Styles
import './scss/App.scss'


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
              <Route path="/planning">
                <Planning />
              </Route>
              {/* Formulaire ressources */}
              <Route path="/agents/create">
                <PageFormAgent />
              </Route>
              <Route path="/agents/:id/edit">
                <PageFormAgent editMode={true}/>
              </Route>

              <Route path="/hotels/create">
                <PageFormHotel />
              </Route>
              <Route path="/hotels/:id/edit">
                <PageFormHotel editMode={true}/>
              </Route>

              <Route path="/visite/create">
                <PageFormVisite />
              </Route>
              <Route exact path="/agents">
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
