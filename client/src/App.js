// Libs
import React from 'react'
import { useHistory, Switch, Route } from 'react-router-dom'

// Shared
import Sidebar from './shared/Sidebar'
import ListAgent from './pages/ListAgent'

// Pages
import Login from './pages/Login'
import ListHotels from './pages/ListHotels'
import Planning from './pages/Planning'
import SecretRoute from './shared/SecretRoute'
import EditPwd from './pages/EditPwd'
import PageFormAgent from './pages/PageFormAgent'
import PageFormHotel from './pages/PageFormHotel'
import PageFormVisite from './pages/PageFormVisite'

// Style
import './scss/App.scss'

function App() {
  
  // router
  const history = useHistory()

  let HideSidebar = history.location.pathname === '/login' ? null : <Sidebar />
  let contentHidebar = history.location.pathname === '/login' ? 'content-login' : 'content'

  console.log("up")
  
  return (
    <div id="App">
        {HideSidebar}
        <div className={contentHidebar}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
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
    </div>
  )
}

export default App
