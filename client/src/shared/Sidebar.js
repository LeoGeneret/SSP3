import React, { useState } from "react";
import "../scss/App.scss";

import { NavLink } from "react-router-dom";

function Sidebar() {
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
            <div className="icon icon-home"></div>
            <p>Accueil</p>
          </NavLink>
          <NavLink to="/list">
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
      <div className="btn-create shadow">Creer un planning</div>
      <div className="btn-create bg-danger shadow">Se deconnecter</div>
    </div>
  );
}

export default Sidebar;
