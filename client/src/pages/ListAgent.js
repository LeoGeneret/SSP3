import React, { useEffect, useState } from "react";
import "../scss/App.scss";
import utils from "../utils";
import { insertAfterElement } from "@fullcalendar/core";

function ListAgent(props) {
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [agentClicked, setagentClicked] = useState({
    nom: "",
    adresse: "",
    ville: "",
    code_postal: "",
    secteur_id: undefined
  });

  const [value, setValue] = useState({
    nom: "",
    adresse: "1 rue Deguerry",
    ville: "qdsfq",
    code_postal: "75664",
    secteur_id: undefined
  });

  const [pagination, setPagination] = useState({
    item_count: "",
    page_current: "",
    page_count: ""
  });

  const handleSubmit = e => {
    e.preventDefault();
    utils
      .fetchReadyData("/visiteur/create", {
        method: "PUT",
        body: JSON.stringify({
          nom: value.nom,
          adresse: value.adresse,
          ville: value.ville,
          code_postal: value.code_postal,
          secteur_id: value.secteur_id
        }),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        if (res.error) {
        } else {
          addTodo(res.data);
          setValue("");
        }
      });
  };

  useEffect(() => {
    utils.fetchReadyData("/visiteur").then(requester => {
      if (requester.error) {
        console.log(requester.error);
      } else {
        setList(requester.data.visiteurs);
        setPagination(requester.data.pagination);
      }
    });
  }, []);

  const addTodo = name => {
    const newValue = [...list, name];
    setList(newValue);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    utils
      .fetchReadyData(`/visiteur/${agentClicked.item.id}/update`, {
        method: "PATCH",
        body: JSON.stringify({
          nom: agentClicked.item.nom,
          secteur_id: Number.parseInt(agentClicked.item.secteur_id),
          adresse: agentClicked.item.adresse,
          ville: agentClicked.item.ville,
        }),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        console.log(res);
        if (res.error) {
        } else {
          setList(list.map( itemEdited => {
            if (itemEdited.id === res.data.id)
              return res.data
            else
              return itemEdited
          }))
        }
      });
  };

  const handleEditAgent = (item) => {
    setOpenModal(!openModal);
    console.log(item.id)
    setagentClicked({
      ...agentClicked,
      item: item
    });
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
      });
  };

  return (
    <div>
      <h1>Liste des agents</h1>
      <div>
        <div className="card row header-list">
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
        </div>
        <div className="card">
          <form className="form-create row" onSubmit={handleSubmit}>
            <input
              className="col-2"
              type="text"
              placeholder="Nom"
              onChange={e => setValue({ ...value, nom: e.target.value })}
            ></input>
            <input
              className="col-2"
              type="text"
              placeholder="Adresse"
              onChange={e => setValue({ ...value, adresse: e.target.value })}
            ></input>
            <input
              className="col-2"
              type="text"
              placeholder="Ville"
              onChange={e => setValue({ ...value, ville: e.target.value })}
            ></input>
            <input
              className="col-2"
              type="text"
              placeholder="CP"
              onChange={e =>
                setValue({ ...value, code_postal: e.target.value })
              }
            ></input>
            <input
              className="col-2"
              type="number"
              min="0"
              max="1"
              placeholder="Secteur"
              onChange={e => setValue({ ...value, secteur_id: e.target.value })}
            ></input>
            <button className="col-2 btn-edit bg-blue">AJOUTER</button>
          </form>
        </div>
        {openModal && (
          <div className="pop-in_edit">
            <form onSubmit={handleSubmitEdit}>
              <input
                type="text"
                placeholder="Nom"
                value={agentClicked.item.nom}   
                onChange={e =>
                  setagentClicked({
                    ...agentClicked,
                    item: { ...agentClicked.item, nom: e.target.value }
                  })
                }
              ></input>
              <input
                type="text"
                placeholder="Secteur"
                value={agentClicked.item.secteur_id}   
                onChange={e =>
                  setagentClicked({ ...agentClicked, adresse: e.target.value })
                }
              ></input>
              <input
                type="text"
                placeholder="Adresse"
                value={agentClicked.item.adresse}   
                onChange={e =>
                  setagentClicked({ ...agentClicked, ville: e.target.value })
                }
              ></input>
              <input
                type="text"
                placeholder="Ville"
                value={agentClicked.item.ville}   
                onChange={e =>
                  setagentClicked({
                    ...agentClicked,
                    code_postal: e.target.value
                  })
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
              <div className="col-4">Adresse</div>
              <div className="col-2">Ville</div>
              <div className="col-2">Actions</div>
            </div>
          </div>
          <ul className="table-container">
            {list.map((item, index) => (
              <li className="row" key={item.id}>
                <p className="col-2">{item.nom}</p>
                <p className="col-1">{item.secteur_id}</p>
                <p className="col-4">{item.adresse}</p>
                <p className="col-2">{item.ville}</p>
                <div className="col-2">
                  {/* <button className="btn-edit" onClick={() => removeList(item.id)}>Supprimer</button> */}
                  <button
                    className="btn-edit"
                    onClick={() => handleEditAgent(item)}
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
      </div>
    </div>
  );
}

export default ListAgent;
