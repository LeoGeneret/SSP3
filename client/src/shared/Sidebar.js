import React, { useState } from "react";
import "../scss/App.scss";
import utils from '../utils'
import { NavLink } from "react-router-dom";
import moment from 'moment'

function Sidebar() {

  const createPlanningAction = () => {
    utils.fetchReadyData("/planning/create?date=" + moment().format("YYYY-MM-DD"), {
      method: "PUT"
    }).then(res => {
      console.log({res})
    })
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
          <div className="Btn myAccount">Mon Compte</div>
        </div>
        <nav>
          <NavLink exact to="/">
            <div className="icon icon-dashboard"></div>
            <p>Accueil</p>
          </NavLink>
          <NavLink to="/agents">
            <div className="icon icon-agents"></div>
            <p>Liste des agents</p>
          </NavLink>
          <NavLink to="/planning">
            <div className="icon icon-planning"></div>
            <p>Les plannings</p>
          </NavLink>
          <NavLink to="/hotels">
            <div className="icon icon-planning"></div>
            <p>Les hôtels</p>
          </NavLink>
        </nav>
      </div>
      <div onClick={createPlanningAction} className="btn-create shadow">Creer un planning</div>
      <div className="btn-create bg-danger shadow">Se deconnecter</div>
    </div>
  );
}

export default Sidebar;
