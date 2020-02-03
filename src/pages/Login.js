import React from "react";
import "../scss/App.scss";

function Login() {
  return (
    <div className="row">
      <div className="d-flex col-4">
        <form className="form-login">
          <input type="text" placeholder="Nom d'utilisateur"></input>
          <input type="text" placeholder="Mot de passe"></input>
          <button className="btn-create" type="submit">Se connecter</button>
        </form>
      </div>
      <div className="col-8">
        <div className="d-flex bg-blue">
          <img className="logo" src="./img/logo.png" />
        </div>
      </div>
    </div>
  );
}

export default Login;
