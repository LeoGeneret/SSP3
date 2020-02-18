import React, { useState, useEffect } from "react";
import utils from "../utils";
import "../scss/App.scss";
import { Switch, NavLink, Route, Router } from "react-router-dom";

function ListHotels(props) {
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [hotelClicked, sethotelClicked] = useState({
    nom: "",
    adresse: "",
    ville: "",
    code_postal: "",
    nombre_chambre: "",
    secteur_id: ""
  });

  const [value, setValue] = useState({
    nom: "",
    adresse: "",
    ville: "",
    code_postal: "",
    nombre_chambre: "",
    secteur_id: ""
  });

  const [pagination, setPagination] = useState({
    item_count: "",
    page_current: "",
    page_count: ""
  });

  const handleSubmit = e => {
    e.preventDefault();
    utils
      .fetchReadyData("/hotel/create", {
        method: "PUT",
        body: JSON.stringify({
          nom: value.nom,
          adresse: value.adresse,
          ville: value.ville,
          code_postal: value.code_postal,
          nombre_chambre: value.nombre_chambre,
          secteur_id: value.secteur_id
        }),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        if (res.error) {
        } else {
          addTodo(res.data);
          setValue({
            ...value,
            nom: "",
            adresse: "",
            ville: "",
            code_postal: "",
            nombre_chambre: "",
            secteur_id: ""
          });
        }
      });
  };

  useEffect(() => {
    utils.fetchReadyData("/hotel").then(requester => {
      if (requester.error) {
        console.log(requester.error);
      } else {
        setList(requester.data.hotels);
        setPagination(requester.data.pagination);
        console.log(requester);
      }
    });
  }, []);

  const addTodo = name => {
    const newValue = [...list, name];
    setList(newValue);
  };

  const handleEditHotel = (item) => {
    setOpenModal(!openModal);
    console.log(item.id)
    sethotelClicked({
      ...hotelClicked,
      nom: item.nom,
      adresse: item.adresse,
      ville: item.ville,
      code_postal: item.code_postal,
      nombre_chambre: item.nombre_chambre,
      secteur_id: item.secteur_id 
    })
    
    
  };

  const removeList = id => {
    utils
      .fetchReadyData("/visiteur/" + id + "/delete", {
        method: "DELETE"
      })
      .then(res => {
        if (res.data) {
          const newValue = [...list];
          const removedItemIndex = newValue.findIndex(item => item.id === id);
          newValue.splice(removedItemIndex, 1);
          setList(newValue);
        }
        console.log(res);
      });
  };
  return (
    <div>
      <h1>Liste des hôtels</h1>
      <div>
        {/* <div className="card row header-list">
          <div className="row justify-center col-4">
            <div className="icon-agents"></div>
            <div>40 salariés</div>
          </div>
          <div className="row justify-center col-4">
            <div className="icon-agents"></div>
            <div>Secteur</div>
          </div>
          <div className="row justify-center col-4">
            <div className="icon-agents"></div>
            <div>
              120 chambres utilisés<br></br> depuis janvier
            </div>
          </div>
        </div> */}

        <NavLink to="/hotels">Liste</NavLink>
        <NavLink to="/hotels/prior">Prioritaires</NavLink>
        <Switch>
          <Route exact path="/hotels">
            <div className="card">
              <form className="form-create row" onSubmit={handleSubmit}>
                <input
                  className="col-2"
                  type="text"
                  required
                  placeholder="Nom"
                  value={value.nom}
                  onChange={e => setValue({ ...value, nom: e.target.value })}
                ></input>
                <input
                  className="col-2"
                  type="text"
                  required
                  placeholder="Adresse"
                  value={value.adresse}
                  onChange={e =>
                    setValue({ ...value, adresse: e.target.value })
                  }
                ></input>
                <input
                  className="col-2"
                  type="text"
                  required
                  placeholder="Ville"
                  value={value.ville}
                  onChange={e => setValue({ ...value, ville: e.target.value })}
                ></input>
                <input
                  className="col-2"
                  type="text"
                  required
                  placeholder="CP"
                  value={value.code_postal}
                  onChange={e =>
                    setValue({ ...value, code_postal: e.target.value })
                  }
                ></input>
                <input
                  className="col-1"
                  type="number"
                  required
                  placeholder="Nb chambres"
                  value={value.nombre_chambre}
                  onChange={e =>
                    setValue({ ...value, nombre_chambre: e.target.value })
                  }
                ></input>
                <input
                  className="col-1"
                  type="number"
                  min="0"
                  max="1"
                  required
                  placeholder="Secteur"
                  value={value.secteur_id}
                  onChange={e =>
                    setValue({ ...value, secteur_id: Number(e.target.value) })
                  }
                ></input>
                <button className="col-2 btn-edit bg-blue">AJOUTER</button>
              </form>
            </div>

            {openModal && (
              <div className="pop-in_edit">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Nom"
                    value={hotelClicked.nom}
                    onChange={e => sethotelClicked({ ...hotelClicked, nom: e.target.value })}
                  ></input>
                  <input
                    type="text"
                    placeholder="Adresse"
                    value={hotelClicked.adresse}
                    onChange={e =>
                      sethotelClicked({ ...hotelClicked, adresse: e.target.value })
                    }
                  ></input>
                  <input
                    type="text"
                    placeholder="Ville"
                    value={hotelClicked.ville}
                    onChange={e =>
                      sethotelClicked({ ...hotelClicked, ville: e.target.value })
                    }
                  ></input>
                  <input
                    type="text"
                    placeholder="CP"
                    value={hotelClicked.code_postal}
                    onChange={e =>
                      sethotelClicked({ ...hotelClicked, code_postal: e.target.value })
                    }
                  ></input>
                  <input
                    type="number"
                    placeholder="Nb chambres"
                    value={hotelClicked.nombre_chambre}
                    onChange={e =>
                      sethotelClicked({ ...hotelClicked, nombre_chambre: e.target.value })
                    }
                  ></input>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    placeholder="Secteur"
                    value={hotelClicked.secteur_id}
                    onChange={e =>
                      sethotelClicked({ ...hotelClicked, secteur_id: e.target.value })
                    }
                  ></input>
                  <button>METTRE A JOUR</button>
                </form>
              </div>
            )}

            <div className="card">
              <div className="table-header">
                <div className="row">
                  <div className="col-2">Nom</div>
                  <div className="col-1">Secteur</div>
                  <div className="col-1">Note logement</div>
                  <div className="col-2">Dernière visite</div>
                  <div className="col-1">Statut</div>
                  <div className="col-2">Action</div>
                </div>
              </div>
              <ul className="table-container">
                {list.map((item, index) => (
                  <li className="row" key={item.id}>
                    <p className="col-2">{item.nom}</p>
                    <p className="col-1">{item.secteur_id}</p>
                    <p className="col-1">4.68</p>
                    <p className="col-2">04/03/2020</p>
                    <p className="col-1">Actif</p>
                    <div className="col-2">
                      <button className="btn-edit" onClick={() => removeList(item.id)}>Supprimer</button>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditHotel(item)}
                      >
                        Modifier
                      </button>
                      <span>{item.pagination}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pagination">
              <span>
                Page {} - {}
              </span>
              <button className="icon-prev btn-prev"></button>
              <button className="icon-next btn-next"></button>
            </div>
          </Route>
          <Route to="/hotels/prior">
            <div className="card">
              <div className="table-header">
                <div className="row">
                  <div className="col-2">Nom</div>
                  <div className="col-1">Secteur</div>
                  <div className="col-1">Note logement</div>
                  <div className="col-2">Dernière visite</div>
                  <div className="col-1">Statut</div>
                  <div className="col-2">Action</div>
                </div>
              </div>
              <ul className="table-container">
                {list.map((item, index) => (
                  <li className="row" key={item.id}>
                    <p className="col-2">{item.nom}</p>
                    <p className="col-1">{item.secteur_id}</p>
                    <p className="col-1">4.68</p>
                    <p className="col-2">04/03/2020</p>
                    <p className="col-1">Actif</p>
                    <div className="col-2">
                      {/* <button className="btn-edit" onClick={() => removeList(item.id)}>Supprimer</button> */}
                      <button
                        className="btn-edit"
                        onClick={() => handleEditHotel()}
                      >
                        Modifier
                      </button>
                      <span>{item.pagination}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default ListHotels;
