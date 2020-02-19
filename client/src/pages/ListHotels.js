import React, { useState, useEffect } from "react";
import utils from "../utils";
import "../scss/App.scss";
import { Switch, NavLink, Route, Router } from "react-router-dom";
import moment from 'moment'

function ListHotels(props) {
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [secteurs, setSecteurs] = useState([]);
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

  const togglePriority = (item) => () => {
    utils
      .fetchReadyData(`/hotel/${item.id}/update`, {
        method: "PATCH",
        body: JSON.stringify({
          priority: !item.priority
        }),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        console.log(res);
        if (res.error) {
        } else {
          setList(list.map(itemEdited => {
            if (itemEdited.id === res.data.id)
              return res.data
            else
              return itemEdited
          }))
        }
      });
  }

  const handleEventClickCreate = () => {
    setOpenModalCreate(!openModalCreate);
  }

  const handleSubmitEdit = (e) => {
    setOpenModal(!openModal);
    e.preventDefault();
    utils
      .fetchReadyData(`/hotel/${hotelClicked.item.id}/update`, {
        method: "PATCH",
        body: JSON.stringify({
          nom: hotelClicked.item.nom,
          adresse: hotelClicked.item.adresse,
          ville: hotelClicked.item.ville,
          code_postal: hotelClicked.item.code_postal,
          nombre_chambre: hotelClicked.item.nombre_chambre,
          priority: hotelClicked.item.priority,
          secteur_id: Number.parseInt(hotelClicked.item.secteur_id)
        }),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        console.log(res);
        if (res.error) {
        } else {
          setList(list.map(itemEdited => {
            if (itemEdited.id === res.data.id)
              return res.data
            else
              return itemEdited
          }))
        }
      });
  };

  useEffect(() => {
    utils.fetchReadyData("/hotel").then(requester => {
      if (requester.error) {
        console.log(requester.error);
      } else {
        setList(requester.data.list);
        setPagination(requester.data.pagination);
        console.log(requester);
      }
    });

    //secteurs
    utils.fetchReadyData("/secteur").then(requester => {
      if (requester.error) {
        console.log(requester.error);
      } else {
        setSecteurs(requester.data);
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
      item: item
    })
  };

  const removeList = id => {

    utils
      .fetchReadyData("/hotel/" + id + "/delete", {
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
        <div className="nav-hotels row">
        </div>
        {openModalCreate && (
          <div className="modal-container">
            <div className="pop-in_edit modal-content shadow">
              <h2>Créer un hotel</h2>
              <form className="flex-column" onSubmit={handleSubmit}>
                <input
                  className="col-12"
                  type="text"
                  required
                  placeholder="Nom"
                  value={value.nom}
                  onChange={e => setValue({ ...value, nom: e.target.value })}
                ></input>
                <input
                  className="col-12"
                  type="text"
                  required
                  placeholder="Adresse"
                  value={value.adresse}
                  onChange={e =>
                    setValue({ ...value, adresse: e.target.value })
                  }
                ></input>
                <input
                  className="col-12"
                  type="text"
                  required
                  placeholder="Ville"
                  value={value.ville}
                  onChange={e => setValue({ ...value, ville: e.target.value })}
                ></input>
                <input
                  className="col-12"
                  type="text"
                  required
                  placeholder="CP"
                  value={value.code_postal}
                  onChange={e =>
                    setValue({ ...value, code_postal: e.target.value })
                  }
                ></input>
                <input
                  className="col-12"
                  type="number"
                  required
                  placeholder="Nb chambres"
                  value={value.nombre_chambre}
                  onChange={e =>
                    setValue({ ...value, nombre_chambre: e.target.value })
                  }
                ></input>
                <select
                  className="col-12"
                  required value={null}
                  onChange={e => setValue({ ...value, secteur_id: Number.parseInt(e.target.value) })}>
                  <option value="">Secteurs</option>
                  {secteurs.map((secteur) => {
                    return (
                      <option key={secteur.id} value={secteur.id}>{secteur.label}</option>
                    )
                  })}
                </select>

                <button className="btn-edit bg-blue">AJOUTER</button>
              </form>
              <button onClick={() => setOpenModalCreate(!openModalCreate)} className="btn-edit btn-large">ANNULER</button>
            </div>
          </div>

        )}



        {openModal && (
          <div className="modal-container">
            <div className="pop-in_edit modal-content shadow">
              <h2>Modifier un hotel</h2>
              <form className="flex-column" onSubmit={handleSubmitEdit}>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Nom"
                  value={hotelClicked.item.nom}
                  onChange={e => sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, nom: e.target.value } })}
                ></input>
                <input
                  className="col-12"
                  type="number"
                  placeholder="Nombres de chambres"
                  value={hotelClicked.item.nom}
                  onChange={e => sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, nombre_chambre: e.target.value } })}
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Adresse"
                  value={hotelClicked.item.adresse}
                  onChange={e =>
                    sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, adresse: e.target.value } })
                  }
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Ville"
                  value={hotelClicked.item.ville}
                  onChange={e =>
                    sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, ville: e.target.value } })
                  }
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="CP"
                  value={hotelClicked.item.code_postal}
                  onChange={e =>
                    sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, code_postal: e.target.value } })
                  }
                ></input>
                <select
                  className="col-12"
                  required value={null}
                  onChange={e => sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, secteur_id: e.target.value } })}
                >
                  <option value="">Secteurs</option>
                  {secteurs.map((secteur) => {
                    return (
                      <option key={secteur.id} value={secteur.id}>{secteur.label}</option>
                    )
                  })}
                </select>

                <button className="btn-edit bg-blue">METTRE A JOUR</button>
              </form>
              <button onClick={() => setOpenModal(!openModal)} className="btn-edit btn-large">ANNULER</button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="table-header">
            <div className="row">
              <div className="col-4">Nom de l'hebergement</div>
              <div className="col-2">Code postal</div>
              <div className="col-1">Note logement</div>
              <div className="col-2">Dernière visite</div>
              <div className="col-1">Actions</div>
              <div className="col-2"></div>
            </div>
          </div>
          <ul className="table-container">
            {list.map((item, index) => {
              return (
                <li className="row" key={item.id}>
                  <p className="col-4">{item.nom}</p>
                  <p className="col-2">{item.code_postal}</p>
                  <p className={`col-1 ${item.last_note <= 30 ? 'badnote' : 'goodnote'}`}>{item.last_note}</p>
                  <p className="col-2">{moment(item.last_visited_at).format('DD/MM/YYYY')}</p>
                  <button onClick={togglePriority(item)} className={'col-1 btn-priority ' + (item.priority ? 'priority-active' : '')}>Urgent</button>
                  <div className="col-2 justify-center">
                    <span className="btn icon-edit" onClick={() => handleEditHotel(item)}></span>
                    <span className="btn icon-supp" onClick={() => removeList(item.id)}></span>
                  </div>
                  <span>{item.pagination}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <div onClick={handleEventClickCreate} className="btn-add-visit shadow">
          <span></span>
          <span></span>
        </div>
        {/* <div className="pagination">
            <span>
              Page {} - {}
            </span>
            <button className="icon-prev btn-prev"></button>
            <button className="icon-next btn-next"></button>
          </div> */}

      </div>
    </div>
  );
}

export default ListHotels;
