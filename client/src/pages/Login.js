import React, { useState } from 'react'
import utils from '../utils'
import { useHistory } from "react-router-dom"

function Login() {

  /** STATES */
  const [stateEmail, setStateEmail] = useState(null)
  const [statePassword, setStatePassword] = useState(null)

  let history = useHistory();
  /** METHODS */

  const submitLogin = event => {
    event.preventDefault()

    if (!stateEmail || !statePassword) {
      // show you must enter email and password!
    } else {
      utils.fetchForm("/auth/signin", {
        "email": stateEmail,
        "password": statePassword
      }).then(response => {
        if (response.error) {
          // credentials or invalid
        } else {
          localStorage.setItem("access_token", response.data.token)
          history.push('/')
        }
      })
        .catch(error => {
          console.error(error)
        })
    }
  }
  


  return (
    <div className="row">
      <div className="d-flex col-4">
        <form className="form-login">
          <input
            onChange={e => setStateEmail(e.target.value)}
            value={stateEmail}
            type="text"
            placeholder="Nom d'utilisateur"
            required
          />
          <input
            onChange={e => setStatePassword(e.target.value)}
            value={statePassword}
            type="password"
            placeholder="Mot de passe"
            required
          />
          {/* <Link className="btn-pwd" to="/EditPwd">Mot de passe oublié ?</Link> */}
          <button onClick={submitLogin} className="btn-create" type="submit">Se connecter</button>
          <span className="d-none pwd-danger">Mot de passe / Email incorrect.</span>
        </form>
      </div>
      <div className="col-8">
        <div className="d-flex bg-blue">
          <img className="logo" src="./img/logo.png" alt="logo" />
        </div>
      </div>
    </div>
  )
}

export default Login

