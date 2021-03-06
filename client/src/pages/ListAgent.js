// Libs
import React, { useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'

// Utils
import utils from '../utils'
import IconSearch from '../icons/icon-search'
import FormSelect from '../shared/FormSelect'

function ListAgent (props) {

  const history = useHistory()

  const [list, setList] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [agentClicked, setagentClicked] = useState({})
  const [secteurs, setSecteurs] = useState([])


  // search module
  const [filterSecteurLabel, setFilterSecteurLabel] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const handleChangeSearch = event => {
    setSearchTerm(event.target.value)
  }


  const [value, setValue] = useState({
    nom: '',
    adresse: '1 rue Deguerry',
    ville: 'qdsfq',
    code_postal: '75664',
    secteur_id: undefined
  })

  const [pagination, setPagination] = useState({ /* eslint-disable-line*/
    item_count: '',
    page_current: '',
    page_count: ''
  })

  const handleEventClickCreate = () => {
    history.push("/agents/create")
  }

  const handleSubmit = e => {
    e.preventDefault()
    setOpenModalCreate(!openModalCreate)
    utils
      .fetchReadyData('/visiteur/create', {
        method: 'PUT',
        body: JSON.stringify({
          nom: value.nom,
          adresse: value.adresse,
          ville: value.ville,
          code_postal: value.code_postal,
          secteur_id: value.secteur_id
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => {
        if (res.error) {
        } else {
          addTodo(res.data)
          setValue('')
        }
      })
  }


  useEffect(() => {
    utils.fetchReadyData('/visiteur').then(requester => {
      if (requester.error) {
        console.log(requester.error)
      } else {
        setList(requester.data.visiteurs)
        setPagination(requester.data.pagination)
      }
    })

        // secteurs
    utils.fetchReadyData('/secteur').then(requester => {
      if (requester.error) {
        console.log(requester.error)
      } else {
        setSecteurs(requester.data)
        console.log(requester)
      }
    })
  }, [])

  const secteurMatch = () => {
    return 'lol'
  }

  const addTodo = name => {
    const newValue = [...list, name]
    setList(newValue)
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault()
    setOpenModal(!openModal)
    utils
      .fetchReadyData(`/visiteur/${agentClicked.item.id}/update`, {
        method: 'PATCH',
        body: JSON.stringify({
          nom: agentClicked.item.nom,
          secteur_id: Number.parseInt(agentClicked.item.secteur_id),
          adresse: agentClicked.item.adresse,
          ville: agentClicked.item.ville
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => {
        console.log(res)
        if (res.error) {
        } else {
          setList(list.map(itemEdited => {
            if (itemEdited.id === res.data.id) { return res.data } else { return itemEdited }
          }))
        }
      })
  }

  const handleEditAgent = (item) => {
    history.push("/agents/" + item.id + "/edit")
  }

  const handleDeleteAgent = (item) => {
    setagentClicked({
      ...agentClicked,
      item: item,
      modalDelete: true
    })
  }

  // Search filter
  const results = list.filter(item => {
    const itemSecteur = item.secteur_id
    const filterSecteur = filterSecteurLabel && Number.parseInt(filterSecteurLabel)
    const resultFilter = item.nom.toLowerCase().includes(searchTerm.toLowerCase()) && (filterSecteur ? itemSecteur === filterSecteur : true)
    return resultFilter
  })

  const removeList = (e) => {

    setOpenModalDelete(!openModalDelete)

    utils
      .fetchReadyData(`/visiteur/${agentClicked.item.id}/delete`, {
        method: 'DELETE'
      })
      .then(res => {
        
        if (res.data) {
          const newValue = [...list]
          const removedItemIndex = newValue.findIndex(item => agentClicked.item.id === item.id)
          newValue.splice(removedItemIndex, 1)
          setList(newValue)
        }
        setagentClicked({
          ...agentClicked,
          modalDelete: false
        })
      })
  }

  return (
    <div className="page-agents">
      <h1 className="page-agents__title">Liste des agents</h1>
      <div className="page-agents__content">
        <div className="nav-hotels row">
          <div className="input-search">
            <IconSearch/>
            <input
              value={searchTerm}
              onChange={handleChangeSearch}
              className="input-search-input"
              placeholder="Rechercher un agent">
            </input>
          </div>
          <div className="filter-secteur">
            <FormSelect 
              placeholder={"Secteur de travail"}
              items={utils.formatSelectSecteur(secteurs)}
              selected={filterSecteurLabel}
              handleChange={e => setFilterSecteurLabel(e.target.value)}
            />
          </div>
          <button onClick={handleEventClickCreate} className="btn-ressource-add">Ajouter un agent</button>
        </div>

        {/* CREATE CREATE CREATE CREATE CREATE CREATE CREATE CREATE CREATE CREATE */}
        {openModalCreate && (
          <div className="modal-container">
            <div className="modal-content pop-in_edit shadow">
              <h2>Créer un agent</h2>
              <form className="flex-column" onSubmit={handleSubmit}>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Nom"
                  onChange={e => setValue({ ...value, nom: e.target.value })}
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Adresse"
                  onChange={e => setValue({ ...value, adresse: e.target.value })}
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Ville"
                  onChange={e => setValue({ ...value, ville: e.target.value })}
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="CP"
                  onChange={e =>
                    setValue({ ...value, code_postal: e.target.value })
                  }
                ></input>
                <input
                  className="col-12"
                  type="number"
                  min="0"
                  max="1"
                  placeholder="Secteur"
                  onChange={e => setValue({ ...value, secteur_id: e.target.value })}
                ></input>
                <button className="col-12 btn-edit bg-blue">AJOUTER</button>
                <button onClick={() => setOpenModalCreate(!openModalCreate)} className="col-12 btn-edit bg-INFO">ANNULER</button>
              </form>
            </div>
          </div>
        )}

        {/* EDIT EDIT EDIT EDIT EDIT EDIT EDIT EDIT EDIT EDIT */}
        {openModal && (
          <div className="modal-container">
            <div className="modal-content pop-in_edit shadow">
              <form className="flex-column" onSubmit={handleSubmitEdit}>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Nom"
                  value={agentClicked.item.nom}
                  onChange={e =>
                    setagentClicked({
                      ...agentClicked,
                      item: {
                        ...agentClicked.item, nom: e.target.value
                      }
                    })
                  }
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Secteur"
                  value={agentClicked.item.secteur_id}
                  onChange={e =>
                    setagentClicked({
                      ...agentClicked,
                      item: {
                        ...agentClicked.item, secteur_id: e.target.value
                      }
                    })
                  }
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Adresse"
                  value={agentClicked.item.adresse}
                  onChange={e =>
                    setagentClicked({
                      ...agentClicked,
                      item: {
                        ...agentClicked.item, adresse: e.target.value
                      }
                    })
                  }
                ></input>
                <input
                  className="col-12"
                  type="text"
                  placeholder="Ville"
                  value={agentClicked.item.ville}
                  onChange={e =>
                    setagentClicked({
                      ...agentClicked,
                      item: {
                        ...agentClicked.item, ville: e.target.value
                      }
                    })
                  }
                ></input>
                <button className="btn-edit bg-blue">METTRE A JOUR</button>
              </form>
              <button onClick={() => setOpenModal(!openModal)} className="btn-edit btn-large">ANNULER</button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="table-header">
            <div className="row">
              <div className="col-2">Nom</div>
              <div className="col-2">Secteur</div>
              <div className="col-4">Adresse</div>
              <div className="col-2">Ville</div>
              <div className="col-2"></div>
            </div>
          </div>
          <ul className="table-container">
            {results.map((item, index) => (
              <li className="row" key={item.id}>
                <p className="col-2">{item.nom}</p>
                <p className="col-2">{item.secteur.label}</p>
                <p className="col-4">{item.adresse}</p>
                <p className="col-2">{item.ville}</p>
                <div className="col-2 justify-center">
                  <a className="btn icon-edit" href={"/agents/" + item.id + "/edit"}></a>
                  <span className="btn icon-delete" onClick={() => handleDeleteAgent(item)}></span>
                </div>
              </li>
            ))}
            {/* DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE */}
            {agentClicked.modalDelete && (
              <div className="modal-container">
                <div className="modal-content modal-delete">
                  <h1 className="text-center">Etes vous sûre de vouloir supprimer cet agent ?</h1>
                  <button className="btn-edit btn-large bg-danger" onClick={() => removeList(agentClicked.item.id)}>SUPPRIMER</button>
                  <button className="btn-edit btn-large" onClick={() => setagentClicked({ modalDelete: false })}>ANNULER</button>
                </div>
              </div>
            )}
          </ul>
        </div>
        {/* <div className="pagination">
          <span>
            Page {} - {}
          </span>
          <button className="icon-arrow-left btn-prev"></button>
          <button className="icon-arrow-right btn-next"></button>
        </div> */}
      </div>
    </div>
  )
}

export default ListAgent
