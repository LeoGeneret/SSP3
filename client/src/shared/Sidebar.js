import React, { useState, useEffect} from "react";
import { NavLink, withRouter, useHistory } from 'react-router-dom'
import moment from 'moment'

// Utils
import utils from '../utils'
import params from '../app.params'

// Assets
import IconLogout from "../icons/IconLogout";


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
          //
          return
        }
  
        setStateUsername(res.data.nom)
        setStateRole(params.WORDING.role[res.data.role])
      })
    }

  }, [])

  /** Methods */

  const createPlanningAction = () => {
    
    const keepgoing = window.confirm("Etes vous sûr de vouloir générer un plannig pour cette semaine ?")
    
    if(keepgoing === true){
      utils.fetchJson("/planning/create?date=" + moment().format("YYYY-MM-DD"), {
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
            <div className="userImg"></div>
            <div className="userInfos">
              <div className="userName">{stateUsername}</div>
              <div className="userStatus">{stateRole}</div>
            </div>
          </div>
          {/* <div className="Btn myAccount">Mon Compte</div> */}
        </div>
        <div onClick={createPlanningAction} className="btn-create shadow sidebar__create-planning">Creer un planning</div>
        <nav>
          {/* <NavLink exact to="/">
            <div className="icon icon-dashboard"></div>
            <p>Accueil</p>
          </NavLink> */}
          <NavLink to="/agents">
            <div className="icon icon-agents"></div>
            <p>Liste des agents</p>
          </NavLink>
          <NavLink to="/planning">
            <div className="icon icon-planning"></div>
            <p>Les plannings</p>
          </NavLink>
          <NavLink to="/" exact>
            <div className="icon icon-hotel"></div>
            <p>Les hôtels</p>
          </NavLink>
        </nav>
      </div>
      <button onClick={handleLogout} className="sidebar__logout">
        Se déconnecter
      </button>
    </div>
  )
}
export default withRouter(Sidebar)
