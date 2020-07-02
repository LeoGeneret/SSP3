// Libs
import React from 'react'
import { useHistory, Switch, Route } from 'react-router-dom'

// Shared
import Sidebar from './shared/Sidebar'
import ListAgent from './pages/ListAgent'
import Notifications from './shared/Notifications'

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
import utils from './utils'

function App() {
  
  // router
  const history = useHistory()


  // State
  const [notifications, setNotifications] = React.useState([])


  React.useEffect(() => {
    utils.fetchJson("/signalement").then(response => {

      if(!response.error){
        setNotifications(response.data)
      }

    })
  }, [])

  // Methods
  const notifyNotifications = () => {

    let nextNotifications = [...notifications]
    let needToBeNotified = nextNotifications.filter(n => !n.notified)

    let promises = needToBeNotified.map(notification => {

      return utils.fetchJson("/signalement/" + (notification.id) + "/notify", {
        method: "PATCH"
      }).then(res => {

        if(!res.error){
          nextNotifications = nextNotifications.map(n => {
            if(n.id === res.data.id){
              return {
                ...n,
                notified: true
              }
            } else {
              return n
            }
          })
        }

      })
    })
    Promise.all(promises).then(res => {
      setNotifications(nextNotifications)
    })
    
  }

  let routeIsLogin = history.location.pathname === '/login'
  let HideSidebar = routeIsLogin ? null : <Sidebar />
  let contentHidebar = routeIsLogin ? 'content-login' : 'content'
  
  return (
    <div id="App">
        {HideSidebar}
        <div className={contentHidebar}>
          {
            !routeIsLogin && (
              <Notifications 
                notifications={notifications}
                notifyNotifications={notifyNotifications}
              />
            )
          }
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <SecretRoute path="/EditPwd">
              <EditPwd />
            </SecretRoute>
            <SecretRoute path="/planning">
              <Planning />
            </SecretRoute>
            {/* Formulaire ressources */}
            <SecretRoute path="/agents/create">
              <PageFormAgent />
            </SecretRoute>
            <SecretRoute path="/agents/:id/edit">
              <PageFormAgent editMode={true}/>
            </SecretRoute>

            <SecretRoute path="/hotels/create">
              <PageFormHotel />
            </SecretRoute>
            <SecretRoute path="/hotels/:id/edit">
              <PageFormHotel editMode={true}/>
            </SecretRoute>

            <SecretRoute path="/visite/create">
              <PageFormVisite />
            </SecretRoute>
            <SecretRoute exact path="/agents">
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
