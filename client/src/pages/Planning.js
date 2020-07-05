import React, { useState, useRef, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import utils from '../utils'
import FullCalendar from '@fullcalendar/react'
import frLocale from '@fullcalendar/core/locales/fr'
import resourceTimeline from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'
import ressourcesBinome from '../datas/ressourcesBinomes.json';

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

  const [calendarDate, setCalendarDate] = useState()

  // Methods

  useEffect(() => {

    let refElement = teamPlanning.current.elRef.current

    let prevButton = refElement.querySelector(".fc-prev-button span")
    let nextButton = refElement.querySelector(".fc-next-button span")

  }, [teamPlanning])

  useEffect(() => {

    // GET Events
    utils
    .fetchJson('/visite?week=' + moment("2020-07-10").format('YYYY-MM-DD'))
    .then(res => {
      if (res.error) {
        console.log(res.error)
      } else {
      
        /** Build binomes */
        let agents = res.data.filter(f => f.agents.length === 2).map(v => v.agents)
        let binomes = getBinomesRessources(agents)
        
        console.log({binomes})

        setRessources(binomes)

        /** Build */
        setEvents(getVisitesEvents(res.data, binomes))

      }
    })

        
    // GET HOTELS
    utils.fetchJson('/hotel/all').then(res => {
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
        associated_binome_int: matchedBinome && matchedBinome.id_int,
        resourceIds: matchedBinome ? [matchedBinome.id] : [],
      }
    })


    events = events.map(e => setEventColor(e, binomes))

    console.log(events)

    return events
  }

  const setEventColor = (eventsItem, resources) => {

    let colorPos = (eventsItem.associated_binome_int / resources.length) * 255
    let color = `hsl(${colorPos}, 60%, 50%)`

    return {
      ...eventsItem,
      color: color,
    }
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


    let eventIdString = eventDropInfo.event.id
    let delta = eventDropInfo.delta.milliseconds
    let newResource = eventDropInfo.newResource

    let beforeEventIndex = events.findIndex(evt => evt.id === eventIdString)
    let beforeEvent = events[beforeEventIndex]

    const eventUpdate = {
      time_start: moment(beforeEvent.start).add(delta, "millisecond").format("YYYY-MM-DDTHH:mm:ssZ"),
      time_end: moment(beforeEvent.end).add(delta, "millisecond").format("YYYY-MM-DDTHH:mm:ssZ"),
      visiteurs: newResource ? newResource.extendedProps.agents.map(agent => agent.id) : undefined
    }

    utils
      .fetchJson(`/visite/${eventIdString}/update`, {
        method: 'PATCH',
        body: JSON.stringify(eventUpdate),
        }).then(res => {

          if(!res.error){
             let nextEvents = [...events]
             nextEvents[beforeEventIndex].start = res.data.start
             nextEvents[beforeEventIndex].end = res.data.end

             setEvents(nextEvents)
          } else {
            eventDropInfo.revert()
          }
        })
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

    var eventCreated = {
      visiteur_id_1: agent1,
      visiteur_id_2: agent2,
      time_start: dateStart,
      time_end: dateEnd,
      hotel_id: hotel,
    }

    utils
      .fetchJson('/visite/create', {
        method: 'PUT',
        body: JSON.stringify(eventCreated),
      })
      .then(res => console.log(res))

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
      <h1 className="page-planning__title">Les plannings</h1>
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
          defaultDate="2020-07-07"
          ref={teamPlanning}
          locale={frLocale}
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
            left: "",
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
