import React, { useState, useRef, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import utils from '../utils'
import FullCalendar from '@fullcalendar/react'
import frLocale from '@fullcalendar/core/locales/fr'
import resourceTimeline from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'
import ressourcesBinome from '../datas/ressourcesBinomes.json';
import hotels from '../datas/hotels.json';
import eventsDatas from '../datas/events.json';

function getRandomColor () {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function Planning () {

  // Others
  const history = useHistory()
  
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

    // GET Events
    utils
      .fetchJson('/planning?week=' + moment().format('YYYY-MM-DD'))
      .then(res => {
        if (res.error) {
          console.log(res.error)
        } else {
        
          /** Build binomes */
          let agents = res.data.visites.map(v => v.agents)
          let binomes = getBinomesRessources(agents)
          setRessources(binomes)

          /** Build visites */
          setEvents(getVisitesEvents(res.data.visites, binomes))

        }
      })

    // GET HOTELS
    utils.fetchJson('/hotel').then(res => {
      if (res.error) {
        console.log(res.error)
      } else {
        setListHotel(res.data.list)
      }
    })
  }, [])

  /** Helpers */

  const getVisitesEvents = (visites, binomes) => {

    let binomesIds = binomes.map(b => b.agents.map(a => a.id))

    let events = visites.map(v => {

      let visitesAgentsIds = v.agents.map(a => a.id)
      let indexOfMatchedBinome = binomesIds.findIndex(binomesIdsItem => visitesAgentsIds.every(visitesAgentsIdsItem => binomesIdsItem.includes(visitesAgentsIdsItem)))
      let matchedBinome = indexOfMatchedBinome !== -1 ? binomes[indexOfMatchedBinome] : null

      return {
        id: v.id_string,
        id_int: v.id,
        title: v.hotel.nom,
        start: v.start,
        end: v.end,
        associated_binome_int: matchedBinome.id_int,
        resourceIds: matchedBinome ? [matchedBinome.id] : [],
      }
    })


    events = events.map(e => {

      let colorPos = (e.associated_binome_int / binomes.length) * 255
      let color = `hsl(${colorPos}, 60%, 50%)`

      return {
        ...e,
        backgroundColor: color,
        borderColor: color,
      }
    })


    return events
  }

  const getBinomesRessources = agents => {

    let binomes = {}

    for(let i = 0; i < agents.length; i++){
      let key = agents[i][0].id + "-" + agents[i][1].id
      binomes[key] = agents[i]
    }
    
    binomes = Object.values(binomes).map((b, index) => ({
      id: index + "", // need to be string,
      id_int: index,
      title: b[0].nom + "\n" + b[1].nom,
      agents: b,
    }))

    return binomes
  }

  /** Events */
  const handleEventClickCreate = () => {
    history.push("/visite/create")
  }

  const handleEventClick = info => {
    setEventClicked(info.event)
    setEventClickedData(info.event._def)
    setEditedEvent({
      title: info.event._def.title,
      agent1: info.event._def.resourceIds[0],
      agent2: info.event._def.resourceIds[1],
      dateStart: info.event.start,
      dateEnd: info.event.end,
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
        .fetchJson(`/visite/${eventId}/update`, {
          method: 'PATCH',
          body: JSON.stringify(eventUpdate),
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

    utils.fetchJson(`/visite/${eventId}/update`, {
      method: 'PATCH',
      body: JSON.stringify(eventUpdate),
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
      .fetchJson('/visite/create', {
        method: 'PUT',
        body: JSON.stringify(eventCreated),
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
    <div className="test page-planning">
      {false && (
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
              <button className="btn-create" type="submit">
                Modifier
              </button>
            </form>

            <button className="btn-create bg-danger" onClick={handleRemove}>
              Supprimer
            </button>
          </div>
        </div>
      )}
      <h1>Les plannings</h1>
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
          eventClick={handleEventClick}
          editable={true}
          droppable={true}
          // resourceGroupField='binome'
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
