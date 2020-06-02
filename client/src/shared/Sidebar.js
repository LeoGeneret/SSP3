import React from "react";
import utils from '../utils'
import { NavLink, withRouter } from 'react-router-dom'
import moment from 'moment'

// Assets
import IconCalendar from "../icons/IconCalendar"
import IconPerson from "../icons/IconPerson"
import IconHotel from "../icons/IconHotel"

function Sidebar (props) {
  const createPlanningAction = () => {
    
    const keepgoing = window.confirm("Etes vous sûr de vouloir générer un plannig pour cette semaine ?")
    
    if(keepgoing === true){
      utils.fetchReadyData("/planning/create?date=" + moment().format("YYYY-MM-DD"), {
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

  return (
    <div className="sidebar" id="Sidebar">
      <div>
        <div className="profile">
          <div className="user">
            <div className="userImg"></div>
            <div className="userInfos">
              <div className="userName">Mathilde Jackson</div>
              <div className="userStatus">Administrateur</div>
            </div>
          </div>
        </div>
        <div onClick={createPlanningAction} className="btn-create shadow">Creer un planning</div>
        <nav>
          {/* <NavLink exact to="/">
            <div className="icon icon-dashboard"></div>
            <p>Accueil</p>
          </NavLink> */}
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
          <NavLink to="/logout" exact>
            <div className="icon icon-power"></div>
            <p>Se déconnecter</p>
          </NavLink>
        </nav>

        
      </div>

      {/* <div className="btn-create bg-danger shadow">Se deconnecter</div> */}
    </div>
  )
}
export default withRouter(Sidebar)
