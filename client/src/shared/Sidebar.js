import React, { useState, useEffect} from "react";
import { NavLink, withRouter, useHistory } from 'react-router-dom'
import moment from 'moment'

// Utils
import utils from '../utils'
import params from '../app.params'

// Assets
import IconCalendar from "../icons/IconCalendar"
import IconPerson from "../icons/IconPerson"
import IconHotel from "../icons/IconHotel"

function Sidebar (props) {

  const [stateUsername, setStateUsername] = useState(null)
  const [stateRole, setStateRole] = useState(null)

  const history = useHistory()

  // ON MOUNT
  useEffect(() => {
    const payload = utils.getPayloadToken()

    if(payload){
      utils.fetchJson(`/user/${payload.id}/info`).then(res => {

        if(res.error){
          return
        }
  
        setStateUsername(res.data.nom)
        setStateRole(params.WORDING.role[res.data.role])
      })
    }

  }, [])

  /** Methods */

  const createPlanningAction = () => {
    
    const keepgoing = window.confirm("Etes vous sûr de vouloir générer un planning pour la semaine prochaine ?")
    
    if(keepgoing === true){
      utils.fetchJson("/algo/planning", {
        method: "PUT"
      }).then(res => {
      
        if(res.error){
          //
        } else {

          if(props.location.pathname === "/planning"){
            props.history.go("/planning")
          } else {
            props.history.push("/planning")
          }
        }
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(params.LOCAL_STORAGE_ACCESS_TOKEN)
    history.push("/login")
  }

  return (
    <div className="sidebar" id="Sidebar">
      <div>
        <div className="profile">
          <div className="user">
            <div className="userImg">
              <IconPerson/>
            </div>
            <div className="userInfos">
              <div className="userName">{stateUsername}</div>
              <div className="userStatus">{stateRole}</div>
            </div>
          </div>
        </div>
        <button onClick={createPlanningAction} className="btn-create shadow sidebar__create-planning">Creer un planning</button>
        <nav>
          <NavLink to="/agents">
            <IconPerson/>
            <p>Liste des agents</p>
          </NavLink>
          <NavLink to="/planning">
            <IconCalendar/>
            <p>Plannings</p>
          </NavLink>
          <NavLink to="/" exact>
          <IconHotel/>
            <p>Répertoires hôtels</p>
          </NavLink>
          <div className="separator"></div>
        </nav>

        
      </div>
      <button onClick={handleLogout} className="sidebar__logout">
        Se déconnecter
      </button>
    </div>
  )
}
export default withRouter(Sidebar)
