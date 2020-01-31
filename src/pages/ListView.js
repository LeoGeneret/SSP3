import React, { useEffect, useState } from "react";
import "../scss/App.scss";
import utils from "../utils";
import { insertAfterElement } from "@fullcalendar/core";

function ListView(props) {
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [visiteurClicked, setVisiteurClicked] = useState({
    nom: "",
    adresse: "",
    ville: "",
    code_postal: "",
    secteur_id: undefined
  })


  const [value, setValue] = useState({
    nom: "",
    adresse: "1 rue Deguerry",
    ville: "qdsfq",
    code_postal: "75664",
    secteur_id: undefined
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
      }
    });
  }, []);

  const addTodo = name => {
    const newValue = [...list, name];
    setList(newValue);
  };


  const handleEditVisiteur = () => {
    setOpenModal(!openModal)
  }



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

  console.log(value.nom);
  return (
    <div>
      <h1>LIST</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom"
            onChange={e => setValue({ ...value, nom: e.target.value })}
          ></input>
          <input
            type="text"
            placeholder="Adresse"
            onChange={e => setValue({ ...value, adresse: e.target.value })}
          ></input>
          <input
            type="text"
            placeholder="Ville"
            onChange={e => setValue({ ...value, ville: e.target.value })}
          ></input>
          <input
            type="text"
            placeholder="CP"
            onChange={e => setValue({ ...value, code_postal: e.target.value })}
          ></input>
          <input
            type="number"
            min="0"
            max="1"
            placeholder="Secteur"
            onChange={e => setValue({ ...value, secteur_id: e.target.value })}
          ></input>
          <button>AJOUTER</button>
        </form>
        {openModal && (
          <div className="pop-in_edit">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nom"
                onChange={e => setValue({ ...value, nom: e.target.value })}
              ></input>
              <input
                type="text"
                placeholder="Adresse"
                onChange={e => setValue({ ...value, adresse: e.target.value })}
              ></input>
              <input
                type="text"
                placeholder="Ville"
                onChange={e => setValue({ ...value, ville: e.target.value })}
              ></input>
              <input
                type="text"
                placeholder="CP"
                onChange={e =>
                  setValue({ ...value, code_postal: e.target.value })
                }
              ></input>
              <input
                type="number"
                min="0"
                max="1"
                placeholder="Secteur"
                onChange={e =>
                  setValue({ ...value, secteur_id: e.target.value })
                }
              ></input>
              <button>METTRE A JOUR</button>
            </form>
          </div>
        )}
      </div>
      <ul>
        {list.map((item, index) => (
          <li key={item.id}>
            {item.nom}
            <button onClick={() => removeList(item.id)}>X</button>
            <button onClick={() => handleEditVisiteur()}>EDIT</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListView;
