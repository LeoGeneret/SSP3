import React from 'react'
import { Link } from 'react-router-dom'

function Login () {
  return (
    <div className="row">
      <div className="d-flex col-4">
        <form className="form-login">
          <input type="text" placeholder="Nom d'utilisateur"></input>
          <input type="text" placeholder="Mot de passe"></input>
          <Link className="btn-pwd" to="/EditPwd">Mot de passe oublié ?</Link>
          <button className="btn-create" type="submit">Se connecter</button>
          <span className="d-none pwd-danger">Mot de passe / Email incorrect.</span>
        </form>
      </div>
      <div className="col-8">
        <div className="d-flex bg-blue">
          <img className="logo" src="./img/logo.png" />
        </div>
      </div>
    </div>
  )
}

export default Login
