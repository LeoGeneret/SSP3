import React, { useState, useRef, useEffect } from 'react'
import utils from '../utils'
import '../scss/App.scss'
import FullCalendar from '@fullcalendar/react'
import frLocale from '@fullcalendar/core/locales/fr'
import resourceTimeline from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'

function Planning () {
  // REFS
  const teamPlanning = useRef(null)
  const [teamPlanningRef, setTeamPlanningRef] = useState(null)

  // STATES
  const [agent1, setAgent1] = useState('')
  const [agent2, setAgent2] = useState('')
  const [hotel, setHotel] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [openPopIn, setOpenPopIn] = useState(false)
  const [openPopInCreate, setopenPopInCreate] = useState(false)
  const [eventClicked, setEventClicked] = useState({})
  const [eventClickedData, setEventClickedData] = useState({})/* eslint-disable-line*/
  const [editedEvent, setEditedEvent] = useState({
    title: '',
    agent1: '',
    agent2: '',
    dateStart: '',
    dateEnd: ''
  })
  const [ressources, setRessources] = useState([])
  const [events, setEvents] = useState([])
  const [listHotel, setListHotel] = useState([])

  useEffect(() => {
    // get FullCalendar API
    const calendarApi = teamPlanning.current.getApi()
    setTeamPlanningRef(calendarApi)

    // GET Visiteur
    utils
      .fetchReadyData('/visiteur?no_limit=1&attributes=id,nom')
      .then(requester => {
        if (requester.error) {
          console.log(requester.error)
        } else {
          setRessources(
            requester.data.visiteurs.map(visiteur => {
              return {
                id: visiteur.id,
                title: visiteur.nom
              }
            })
          )
        }
      })

    // GET Events
    utils
      .fetchReadyData('/planning?date=' + moment().format('YYYY-MM-DD'))
      .then(requester => {
        if (requester.error) {
          console.log(requester.error)
        } else {
          setEvents(requester.data.events)
        }
      })

    // GET HOTELS
    utils.fetchReadyData('/hotel').then(requester => {
      if (requester.error) {
        console.log(requester.error)
      } else {
        setListHotel(requester.data.list)
        console.log(requester)
      }
    })
  }, [])

  const handleEventClickCreate = () => {
    setopenPopInCreate(!openPopInCreate)
  }

  const handleEventClick = info => {
    setEventClicked(info.event)
    setEventClickedData(info.event._def)
    setEditedEvent({
      title: info.event._def.title,
      agent1: info.event._def.resourceIds[0],
      agent2: info.event._def.resourceIds[1],
      dateStart: info.event.start,
      dateEnd: info.event.end
    })
    setOpenPopIn(!openPopIn)
  }

  // ON DROP EVENT
  const handleDropEvent = eventDropInfo => {
    var eventId = eventDropInfo.event.id
    if (!eventDropInfo.event.end) {
      eventDropInfo.revert()
    } else {
      const eventUpdate = {
        time_start: moment(eventDropInfo.event.start),
        time_end: moment(eventDropInfo.event.end),
        visited_at: moment(eventDropInfo.event.start),
        visiteur_id_1: eventDropInfo.event._def.resourceIds[0],
        visiteur_id_2: eventDropInfo.event._def.resourceIds[1]
      }

      utils
        .fetchReadyData(`/visite/${eventId}/update`, {
          method: 'PATCH',
          body: JSON.stringify(eventUpdate),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => console.log(res))
    }
  }

  // ON RESIZE EVENT
  const handleResizeEvent = eventResizeInfo => {
    var eventId = eventResizeInfo.event.id

    const eventUpdate = {
      time_start: moment(eventResizeInfo.event.start),
      time_end: moment(eventResizeInfo.event.end)
    }

    utils.fetchReadyData(`/visite/${eventId}/update`, {
      method: 'PATCH',
      body: JSON.stringify(eventUpdate),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => console.log(res))
  }

  const handleRemove = () => {
    eventClicked.remove()
    setOpenPopIn(!openPopIn)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setopenPopInCreate(!openPopInCreate)

    // let newBinome = [agent1, agent2];
    // let newDateStart = dateStart;
    // let newDateEnd = dateEnd;

    // let newEvent = {
    //   title: "Visite",
    //   resourceIds: newBinome,
    //   start: newDateStart,
    //   end: newDateEnd
    // };

    // if (agent1 === "" || agent2 === "")
    //   alert("Vous n'avez pas selectionné 2 agents");
    // else if (agent1 === agent2) alert("Vous avez selectionné le même agent");
    // else if (dateStart === "" || dateEnd === "") alert("Il manque une date");
    // else {
    //   teamPlanningRef.addEvent(newEvent);
    //   // RESET INPUTS
    //   setAgent1("");
    //   setAgent2("");
    //   setDateStart("");
    //   setDateEnd("");
    // }

    var eventCreated = {
      visiteur_id_1: agent1,
      visiteur_id_2: agent2,
      time_start: dateStart,
      time_end: dateEnd,
      hotel_id: hotel,
      visited_at: dateStart
    }

    utils
      .fetchReadyData('/visite/create', {
        method: 'PUT',
        body: JSON.stringify(eventCreated),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => console.log(res))

    console.log(teamPlanningRef)
  }

  const handleEditEvent = e => {
    e.preventDefault()

    const editedTitle = editedEvent.title   /* eslint-disable-line*/
    const editedBinome = [editedEvent.agent1, editedEvent.agent2]
    const editedDateStart = editedEvent.dateStart
    const editedDateEnd = editedEvent.dateEnd

    eventClicked.setResources(editedBinome)
    eventClicked.setDates(editedDateStart, editedDateEnd)
    setOpenPopIn(!openPopIn)
  }

  return (
    <div className="test">
      {openPopIn && (
        <div className="formContainer" id="popin">
          <div className={`pop-in ${openPopIn ? 'active' : ''}`}>
            <form onSubmit={handleEditEvent}>
              {/* <select
                value={editedEvent.agent1}
                onChange={e =>
                  setEditedEvent({
                    ...editedEvent,
                    agent1: e.target.value
                  })
                }
              >
                <option>Selectionnez agent 1</option>
                {ressources.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.nom}
                  </option>
                ))}
              </select>
              <select
                value={editedEvent.agent2}
                onChange={e =>
                  setEditedEvent({
                    ...editedEvent,
                    agent2: e.target.value
                  })
                }
              >
                <option>Selectionnez agent 2</option>
                {ressources.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.nom}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                placeholder="Date de début"
                onChange={e =>
                  setEditedEvent({
                    ...editedEvent,
                    dateStart: e.target.value
                  })
                }
                value={editedEvent.dateStart}
              />
              <input
                type="datetime-local"
                placeholder="Date de fin"
                onChange={e =>
                  setEditedEvent({
                    ...editedEvent,
                    dateEnd: e.target.value
                  })
                }
                value={editedEvent.dateEnd}
              /> */}
              {/* <button className="btn-create" type="submit">
                Modifier
              </button> */}
            </form>

            <button className="btn-create bg-danger" onClick={handleRemove}>
              Supprimer
            </button>
          </div>
        </div>
      )}
      <h1>Les plannings</h1>
      <div className="container-filter card">
        <h3>Filter par</h3>
        <div className="row">
          {/* <div className="col-4">
            <span>Catégories :</span>
            <div className="row f-wrap">
              <input
                className="input-filter"
                type="checkbox"
                id="all"
                name="all"
              ></input>
              <label className="btn-filter" for="all">
                Tous
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="urgence"
                name="urgence"
              ></input>
              <label className="btn-filter" for="urgence">
                Urgence
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="duration"
                name="duration"
              ></input>
              <label className="btn-filter" for="duration">
                Longue durée
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="relance"
                name="relance"
              ></input>
              <label className="btn-filter" for="relance">
                relance
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="suspent"
                name="suspent"
              ></input>
              <label className="btn-filter" for="suspent">
                En suspent
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="Anomalies"
                name="Anomalies"
              ></input>
              <label className="btn-filter" for="Anomalies">
                Anomalies
              </label>
            </div>
          </div> */}
          <div className="col-4">
            <span>Secteur :</span>
            <div className="row f-wrap">
              <input
                className="input-filter"
                type="checkbox"
                id="secteurs"
                name="secteurs"
              ></input>
              <label className="btn-filter" htmlFor="secteurs">
                Tous
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="paris"
                name="paris"
              ></input>
              <label className="btn-filter" htmlFor="paris">
                paris
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="92"
                name="92"
              ></input>
              <label className="btn-filter" htmlFor="92">
                92
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="77-91"
                name="77-91"
              ></input>
              <label className="btn-filter" htmlFor="77-91">
                77-91
              </label>

              <input
                className="input-filter"
                type="checkbox"
                id="93"
                name="93"
              ></input>
              <label className="btn-filter" htmlFor="93">
                93
              </label>
            </div>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
      {openPopInCreate && (
        <div className="modal-container">
          <div className="modal-content">
            <form className='flex-column' onSubmit={handleSubmit}>
              <select className='col-12' value={agent1} onChange={e => setAgent1(e.target.value)}>
                <option>Selectionnez agent 1</option>
                {ressources.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <select className='col-12' value={agent2} onChange={e => setAgent2(e.target.value)}>
                <option>Selectionnez agent 2</option>
                {ressources.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <select className='col-12' value={hotel} onChange={e => setHotel(e.target.value)}>
                <option>Selectionnez hotel</option>
                {listHotel.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.nom} {item.code_postal}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                placeholder="Date de début"
                onChange={e => setDateStart(e.target.value)}
                value={dateStart}
              />
              <input
                type="datetime-local"
                placeholder="Date de fin"
                onChange={e => setDateEnd(e.target.value)}
                value={dateEnd}
              />
              <button className="btn-create" type="submit">
                Ajouter
              </button>
              <button className="btn-edit" type="">
                Annuler
              </button>
            </form>

          </div>
        </div>
      )}
      <div className="card calendar-container">
        <FullCalendar
          locale={frLocale}
          ref={teamPlanning}
          defaultView="resourceTimelineWeek"
          resourceAreaWidth="15%"
          minTime="09:00:00"
          maxTime="21:00:00"
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
          slotDuration="01:00:00"
          // slotLabelFormat={[{
          //   weekday: 'long',
          //   day: 'numeric',
          //   month: 'short'
          // },
          // {
          //   hour: 'numeric'
          // }]}
          eventClick={handleEventClick}
          editable={true}
          droppable={true}
          header={{
            left: 'prev,next',
            center: 'title',
            right: 'resourceTimelineDay, resourceTimelineWeek'
          }}
          disableDragging={true}
          views={{
            week: {
              titleFormat: { day: '2-digit', month: 'long' }
            }
          }}
          resourceColumns={[
            {
              labelText: 'Visiteurs'
            }
          ]}
          resources={ressources}
          plugins={[resourceTimeline, interactionPlugin]}
          weekends={false}
          events={events}
          eventDrop={handleDropEvent}
          eventResize={handleResizeEvent}
        />
        <div onClick={handleEventClickCreate} className="btn-add-visit shadow">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

export default Planning
