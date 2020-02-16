import React from "react";
import "../scss/App.scss";

import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div id="Sidebar">
      <div>
        <div className="profile">
          <div className="userImg"></div>
          <div>Mathilde Jackson</div>
        </div>
        <nav>
          <ul>
            <li>
              <div className="icon icon-home"></div>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <div className="icon icon-agents"></div>
              <Link to="/list">Liste des agents</Link>
            </li>
            <li>
              <div className="icon icon-planning"></div>
              <Link to="/planning">Les plannings</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="Btn signOut">Se deconnecter</div>
    </div>
  );
}

export default Sidebar;
