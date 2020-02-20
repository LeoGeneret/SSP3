import React from 'react'
import '../scss/App.scss'

function EditPwd () {
  return (
    <div className="row">
      <div className="d-flex col-4">
        <form className="form-login form-edit-pwd">
          <h1>Modification de mot de passe</h1>
          <input type="text" placeholder="Mot de passe"></input>
          <input type="text" placeholder="Comfirmer mot de passe"></input>
          <button className="btn-create" type="submit">Comfirmer</button>
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

export default EditPwd
