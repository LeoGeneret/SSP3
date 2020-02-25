import React, { useState } from "react";
import PropTypes from 'prop-types'
import utils from '../utils'
import { NavLink, withRouter } from 'react-router-dom'
import moment from 'moment'

function Sidebar (props) {
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

  return (
    <div id="Sidebar">
      <div>
        <div className="profile">
          <div className="user">
            <div className="userImg"></div>
            <div className="userInfos">
              <div className="userName">Mathilde Jackson</div>
              <div className="userStatus">Administrateur</div>
            </div>
          </div>
          {/* <div className="Btn myAccount">Mon Compte</div> */}
        </div>
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
      <div onClick={createPlanningAction} className="btn-create shadow">Creer un planning</div>
      {/* <div className="btn-create bg-danger shadow">Se deconnecter</div> */}
    </div>
  )
}
export default withRouter(Sidebar)
