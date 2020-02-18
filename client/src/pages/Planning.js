import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import utils from "../utils";
import "../scss/App.scss";
import FullCalendar from "@fullcalendar/react";
import resourceTimeline from "@fullcalendar/resource-timeline";

function Planning() {
  //REFS
  const teamPlanning = useRef(null);
  const [teamPlanningRef, setTeamPlanningRef] = useState(null);

  // STATES
  const [agent1, setAgent1] = useState("");
  const [agent2, setAgent2] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [openPopIn, setOpenPopIn] = useState(false);
  const [eventClicked, setEventClicked] = useState({});
  const [eventClickedData, setEventClickedData] = useState({});
  const [editedEvent, setEditedEvent] = useState({
    title: "",
    agent1: "",
    agent2: "",
    dateStart: "",
    dateEnd: ""
  });
  const [ressources, setRessources] = useState([]);

  useEffect(() => {
    // get FullCalendar API
    let calendarApi = teamPlanning.current.getApi();
    setTeamPlanningRef(calendarApi);

    //Acces Visiteur
    utils.fetchReadyData("/visiteur").then(requester => {
      if (requester.error) {
        console.log(requester.error);
      } else {
        setRessources(requester.data.visiteurs);
        console.log(ressources);
      }
    });


  }, []);



  const handleEventClick = info => {
    setEventClicked(info.event);
    setEventClickedData(info.event._def);
    setEditedEvent({
      title: info.event._def.title,
      agent1: info.event._def.resourceIds[0],
      agent2: info.event._def.resourceIds[1],
      dateStart: info.event.start,
      dateEnd: info.event.end
    });
    setOpenPopIn(!openPopIn);
  };

  const handleRemove = () => {
    console.log(eventClicked);
    eventClicked.remove();
    setOpenPopIn(!openPopIn);
  };

  const handleSubmit = e => {
    e.preventDefault();

    let newBinome = [agent1, agent2];
    let newDateStart = dateStart;
    let newDateEnd = dateEnd;

    let newEvent = {
      title: "Visite",
      resourceIds: newBinome,
      start: newDateStart,
      end: newDateEnd
    };

    if (agent1 === "" || agent2 === "")
      alert("Vous n'avez pas selectionné 2 agents");
    else if (agent1 === agent2) alert("Vous avez selectionné le même agent");
    else if (dateStart === "" || dateEnd === "") alert("Il manque une date");
    else {
      teamPlanningRef.addEvent(newEvent);
      // RESET INPUTS
      setAgent1("");
      setAgent2("");
      setDateStart("");
      setDateEnd("");
    }
  };

  const handleEditEvent = e => {
    e.preventDefault();
    console.log("le form senvoie");

    let editedTitle = editedEvent.title;
    let editedBinome = [editedEvent.agent1, editedEvent.agent2];
    let editedDateStart = editedEvent.dateStart;
    let editedDateEnd = editedEvent.dateEnd;

    eventClicked.setResources(editedBinome);
    eventClicked.setDates(editedDateStart, editedDateEnd);
    setOpenPopIn(!openPopIn);

  };

  return (
    <div className="test">
      {openPopIn && (
        <div id="popin">
          <div className={`pop-in ${openPopIn ? "active" : ""}`}>
            <h1>{eventClickedData.title}</h1>
            <form onSubmit={handleEditEvent}>
              <select
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
                onChange={e => setEditedEvent({
                  ...editedEvent,
                  dateStart: e.target.value
                })}
                value={editedEvent.dateStart}
              />
              <input
                type="datetime-local"
                placeholder="Date de fin"
                onChange={e => setEditedEvent({
                  ...editedEvent,
                  dateEnd: e.target.value
                })}
                value={editedEvent.dateEnd}
              />
              <button type="submit">EDITER</button>
            </form>

            <button onClick={handleRemove}>SUPP</button>
          </div>
        </div>
      )}
      <h1>Les plannings</h1>
      <div className="container-filter card">
        <h3>Filter par</h3>
        <div className="row">
          <div className="col-4">
            <span>Catégories :</span>
            <div className="row f-wrap">
              <input className="input-filter" type="checkbox" id="all" name="all"></input>
              <label className="btn-filter" for="all">Tous</label>

              <input className="input-filter" type="checkbox" id="urgence" name="urgence"></input>
              <label className="btn-filter" for="urgence">Urgence</label>

              <input className="input-filter" type="checkbox" id="duration" name="duration"></input>
              <label className="btn-filter" for="duration">Longue durée</label>

              <input className="input-filter" type="checkbox" id="relance" name="relance"></input>
              <label className="btn-filter" for="relance">relance</label>

              <input className="input-filter" type="checkbox" id="suspent" name="suspent"></input>
              <label className="btn-filter" for="suspent">En suspent</label>

              <input className="input-filter" type="checkbox" id="Anomalies" name="Anomalies"></input>
              <label className="btn-filter" for="Anomalies">Anomalies</label>
            </div>
          </div>
          <div className="col-4">
            <span>Secteur :</span>
            <div className="row f-wrap">
              <input className="input-filter" type="checkbox" id="secteurs" name="secteurs"></input>
              <label className="btn-filter" for="secteurs">Tous</label>

              <input className="input-filter" type="checkbox" id="paris" name="paris"></input>
              <label className="btn-filter" for="paris">paris</label>

              <input className="input-filter" type="checkbox" id="92" name="92"></input>
              <label className="btn-filter" for="92">92</label>

              <input className="input-filter" type="checkbox" id="77-91" name="77-91"></input>
              <label className="btn-filter" for="77-91">77-91</label>

              <input className="input-filter" type="checkbox" id="93" name="93"></input>
              <label className="btn-filter" for="93">93</label>

            </div>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <select value={agent1} onChange={e => setAgent1(e.target.value)}>
            <option>Selectionnez agent 1</option>
            {ressources.map((item, index) => (
              <option key={index} value={item.id}>
                {item.nom}
              </option>
            ))}
          </select>
          <select value={agent2} onChange={e => setAgent2(e.target.value)}>
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
            onChange={e => setDateStart(e.target.value)}
            value={dateStart}
          />
          <input
            type="datetime-local"
            placeholder="Date de fin"
            onChange={e => setDateEnd(e.target.value)}
            value={dateEnd}
          />
          <button type="submit">Ajouter</button>
        </form>
      </div>
      <div className="card calendar-container">
        <FullCalendar
          lang="fr"
          ref={teamPlanning}
          defaultView="resourceTimelineWeek"
          resourceAreaWidth="15%"
          // minTime="09:00:00"
          // maxTime="21:00:00"
          slotDuration="24:00:00"
          slotLabelFormat={[{
            weekday: 'long',
            day: 'numeric',
            month: 'short'
          },
          {
            hour: 'numeric'
          }]}
          eventClick={handleEventClick}
          header={{
            left: "prev,next",
            center: "title",
            right: "resourceTimelineDay, resourceTimelineWeek"
          }}
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
          resources={ressources.map(resource => ({
            id: resource.id,
            title: resource.nom
          }))}
          plugins={[resourceTimeline]}
          schedulerLicenseKey="GPL-My-Project-Is-O  pen-Source"
          weekends={false}
          events={[
            {
              id: 1,
              title: "Hôtel de la cloche",
              resourceIds: ["a", "d"],
              start: "2020-01-28",
              end: "2020-01-30"
            },
            {
              id: 2,
              title: "Hôtel luxe ***",
              resourceIds: ["a", "b"],
              start: "2020-01-27",
              end: "2020-01-28"
            }
          ]}
        />
      </div>
    </div>
  );
}

export default Planning;
