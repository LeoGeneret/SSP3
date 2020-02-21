import React, { useState, useEffect } from 'react'
import utils from '../utils'
import '../scss/App.scss'
import moment from 'moment'

function ListHotels (props) {
  const [list, setList] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [openModalCreate, setOpenModalCreate] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [enableEdit, setEnableEdit] = useState(false)
  const [secteurs, setSecteurs] = useState([])
  const [hotelClicked, sethotelClicked] = useState({})

  // search module
  const [filterSecteurLabel, setFilterSecteurLabel] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const handleChangeSearch = event => {
    setSearchTerm(event.target.value)
  }

  const [value, setValue] = useState({
    nom: '',
    adresse: '',
    ville: '',
    code_postal: '',
    nombre_chambre: '',
    secteur_id: ''
  })

  const [pagination, setPagination] = useState({/* eslint-disable-line*/
    item_count: '',
    page_current: '',
    page_count: ''
  })

  const handleSubmit = e => {
    e.preventDefault()
    setOpenModalCreate(!openModalCreate)

    utils
      .fetchReadyData('/hotel/create', {
        method: 'PUT',
        body: JSON.stringify({
          nom: value.nom,
          adresse: value.adresse,
          ville: value.ville,
          code_postal: value.code_postal,
          nombre_chambre: value.nombre_chambre,
          secteur_id: value.secteur_id
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => {
        if (res.error) {
        } else {
          addTodo(res.data)
          setValue({
            ...value,
            nom: '',
            adresse: '',
            ville: '',
            code_postal: '',
            nombre_chambre: '',
            secteur_id: ''
          })
        }
      })
  }

  const togglePriority = (item) => () => {
    utils
      .fetchReadyData(`/hotel/${item.id}/update`, {
        method: 'PATCH',
        body: JSON.stringify({
          priority: !item.priority
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => {
        console.log(res)
        if (res.error) {
        } else {
          setList(list.map(itemEdited => {
            if (itemEdited.id === res.data.id) { return { ...itemEdited, priority: res.data.priority } } else { return itemEdited }
          }))
        }
      })
  }

  const handleEventClickCreate = () => {
    setOpenModalCreate(!openModalCreate)
  }

  const handleSubmitEdit = (e) => {
    setOpenModal(!openModal)
    e.preventDefault()
    utils
      .fetchReadyData(`/hotel/${hotelClicked.item.id}/update`, {
        method: 'PATCH',
        body: JSON.stringify({
          nom: hotelClicked.item.nom,
          adresse: hotelClicked.item.adresse,
          ville: hotelClicked.item.ville,
          code_postal: hotelClicked.item.code_postal,
          nombre_chambre: hotelClicked.item.nombre_chambre,
          priority: hotelClicked.item.priority,
          secteur_id: Number.parseInt(hotelClicked.item.secteur_id)
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

  useEffect(() => {
    utils.fetchReadyData('/hotel').then(requester => {
      if (requester.error) {
        console.log(requester.error)
      } else {
        setList(requester.data.list)
        setPagination(requester.data.pagination)
        console.log(requester)
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

  // Search filter
  const results = list.filter(item => {
    const itemSecteur = item.secteur.id
    const filterSecteur = filterSecteurLabel && Number.parseInt(filterSecteurLabel)
    const resultFilter = item.nom.toLowerCase().includes(searchTerm.toLowerCase()) && (filterSecteur ? itemSecteur === filterSecteur : true)
    return resultFilter
  }

  )

  // Add to list
  const addTodo = name => {
    const newValue = [...list, name]
    setList(newValue)
  }

  const handleEditHotel = (item) => {
    setOpenModal(!openModal)
    sethotelClicked({
      ...hotelClicked,
      item: item
    })
  }

  const handleDeleteHotel = (item) => {
    sethotelClicked({
      ...hotelClicked,
      item: item,
      modalDelete: true

    })
  }

  const removeList = (e) => {
    setOpenModalDelete(!openModalDelete)
    utils
      .fetchReadyData(`/hotel/${hotelClicked.item.id}/delete`, {
        method: 'DELETE'
      })
      .then(res => {
        if (res.data) {
          const newValue = [...list]
          const removedItemIndex = newValue.findIndex(item => hotelClicked.item.id === item.id)
          newValue.splice(removedItemIndex, 1)
          setList(newValue)
        }
        sethotelClicked({
          ...hotelClicked,
          modalDelete: false
        })
      })
  }
  return (
    <div>
      <h1>Liste des hôtels</h1>
      <br></br>
      <div>
        <div className="row">
          <div className="input-search">
            <span className="icon-magnifying-glass"></span>
            <input
              value={searchTerm}
              onChange={handleChangeSearch}
              className="input-search"
              placeholder="Rechercher un hôtel">
            </input>
          </div>
          <div className="select-search">
            <select
              onChange={e => setFilterSecteurLabel(e.target.value)}>
              <option>Secteurs</option>
              {secteurs.map((secteur) => {
                return (
                  <option key={secteur.id} value={secteur.id}>{secteur.label}</option>
                )
              })}
            </select>
          </div>
        </div>
        <br></br>

        {/* CREATE CREATE CREATE CREATE CREATE CREATE CREATE CREATE CREATE CREATE */}
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
                  required
                  onChange={e => setValue({ ...value, secteur_id: Number.parseInt(e.target.value) })}>
                  <option value="">Secteurs</option>
                  {secteurs.map((secteur) => {
                    return (
                      <option key={secteur.id} value={secteur.id}>{secteur.label}</option>
                    )
                  })}
                </select>
                <button className="btn-edit bg-blue">AJOUTER</button>
                <button onClick={() => setOpenModalCreate(!openModalCreate)} className="btn-edit">ANNULER</button>
              </form>
            </div>
          </div>
        )}

        {/* EDIT EDIT EDIT EDIT EDIT EDIT EDIT EDIT EDIT EDIT */}
        {openModal && (
          <div className="modal-container">
            <div className="pop-in_edit modal-content shadow">
              <h2>Modifier un hotel</h2>
              <span className="btn-edit-enable icon-edit"
                onClick={() => setEnableEdit(!enableEdit)}>
              </span>
              <form className="flex-column" onSubmit={handleSubmitEdit}>
                <input
                  disabled={enableEdit ? false : 'disabled'}
                  className="col-12"
                  type="text"
                  placeholder="Nom"
                  value={hotelClicked.item.nom}
                  onChange={e => sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, nom: e.target.value } })}
                ></input>
                <input
                  disabled={enableEdit ? false : 'disabled'}
                  className="col-12"
                  type="number"
                  placeholder="Nombres de chambres"
                  value={hotelClicked.item.nombre_chambre}
                  onChange={e => sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, nombre_chambre: e.target.value } })}
                ></input>
                <input
                  disabled={enableEdit ? false : 'disabled'}
                  className="col-12"
                  type="text"
                  placeholder="Adresse"
                  value={hotelClicked.item.adresse}
                  onChange={e =>
                    sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, adresse: e.target.value } })
                  }
                ></input>
                <input
                  disabled={enableEdit ? false : 'disabled'}
                  className="col-12"
                  type="text"
                  placeholder="Ville"
                  value={hotelClicked.item.ville}
                  onChange={e =>
                    sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, ville: e.target.value } })
                  }
                ></input>
                <input
                  disabled={enableEdit ? false : 'disabled'}
                  className="col-12"
                  type="text"
                  placeholder="CP"
                  value={hotelClicked.item.code_postal}
                  onChange={e =>
                    sethotelClicked({ ...hotelClicked, item: { ...hotelClicked.item, code_postal: e.target.value } })
                  }
                ></input>
                <select
                  disabled={enableEdit ? false : 'disabled'}
                  defaultValue={hotelClicked.item.secteur.id}
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
              <div className="col-4">Nom de l'hebergement</div> {/* eslint-disable-line*/}
              <div className="col-2">Code postal</div>
              <div className="col-2">Dernière note</div>
              <div className="col-2">Dernière visite</div>
              <div className="col-2">Actions</div>
              <div className="col-1"></div>
            </div>
          </div>
          <ul className="table-container">
            {results.map((item, index) => {
              return (
                <li className="row" key={item.id}>
                  <p className="col-4">{item.nom}</p>
                  <p className="col-2">{item.code_postal}</p>
                  <div className="col-2">
                    <p className={`${item.last_note <= 30 ? 'badnote' : item.last_note <= 40 ? 'moyennote' : item.last_note == null ? 'item.notnote' : 'goodnote'}`}>
                      {item.last_note == null ? 'Aucune note' : item.last_note}</p>
                  </div>
                  <p className="col-2">{item.last_visited_at == null ? 'Aucune date' : moment(item.last_visited_at).format('DD/MM/YYYY')}</p>
                  <div className="col-2">
                    <button onClick={togglePriority(item)} className={'btn-priority ' + (item.priority ? 'priority-active' : '')}>
                      <span className="icon-alert-outline"></span>
                      Urgent
                    </button>
                  </div>
                  <div className="col-1 justify-center">
                    <span className="btn icon-more-horiz" onClick={() => handleEditHotel(item)}></span>
                    <span className="btn icon-delete" onClick={() => handleDeleteHotel(item)}></span>
                  </div>
                </li>
              )
            })}
            {/* DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE DELETE */}
            {hotelClicked.modalDelete && (
              <div className="modal-container">
                <div className="modal-content modal-delete">
                  <h1>Etes vous sûre de vouloir supprimer cet hôtels ? </h1>
                  <button className="btn-edit btn-large bg-danger" onClick={() => removeList(hotelClicked.item.id)}>SUPPRIMER</button>
                  <button className="btn-edit btn-large" onClick={() => sethotelClicked({ modalDelete: false })}>ANNULER</button>
                </div>
              </div>
            )}
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
    </div >
  )
}

export default ListHotels
