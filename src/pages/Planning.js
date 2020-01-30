import React, { useState, useRef, useEffect } from "react";
import ReactDOM from 'react-dom';
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
  const [resourcesList, setResourcesList] = useState([]);
  const [openPopIn, setOpenPopIn] = useState(false);
  const [eventClicked, setEventClicked] = useState({});
  const [eventClickedData, setEventClickedData] = useState({title: ''});


  useEffect(() => {
    // get FullCalendar API
    let calendarApi = teamPlanning.current.getApi();
    setTeamPlanningRef(calendarApi);

    // Access resources
    setResourcesList(teamPlanning.current.props.resources);
  }, []);

  useEffect(
    () => popInRender()
    , [openPopIn]
  )

  useEffect(
    () => popInRender()
    , [eventClicked]
  )

  const handleEventClick = (info) => {
    console.log(info.event.title)
    setEventClicked(info)
    setEventClickedData({title: info.event.title})
    setOpenPopIn(!openPopIn)
  }

  const popInRender = () => {
    const popin = (
      <div className={`pop-in ${openPopIn ? 'active' : ''}`}> 
        <h1>{eventClickedData.title}</h1>
        <button onClick={handleRemove}>SUPP</button>
      </div>
    )
    ReactDOM.render(popin, document.getElementById('popin'));
  }


  const handleRemove = () => {
    console.log(eventClicked);
    eventClicked.event.remove()
    setOpenPopIn(!openPopIn)
  }

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


  return (
    <div className="test">
      <div id="popin"></div>
      <h1>PLANNING</h1>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <select value={agent1} onChange={e => setAgent1(e.target.value)}>
            <option>Selectionnez agent 1</option>
            {resourcesList.map((item, index) => (
              <option key={index} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <select value={agent2} onChange={e => setAgent2(e.target.value)}>
            <option>Selectionnez agent 2</option>
            {resourcesList.map((item, index) => (
              <option key={index} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Date de début"
            onChange={e => setDateStart(e.target.value)}
            value={dateStart}
          />
          <input
            type="date"
            placeholder="Date de fin"
            onChange={e => setDateEnd(e.target.value)}
            value={dateEnd}
          />
          <button type="submit">Ajouter</button>
        </form>
      </div>
      <div className="calendar-container">
        <FullCalendar
          ref={teamPlanning}
          defaultView="resourceTimelineWeek"
          eventClick={handleEventClick}
          header={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
          }}
          resources={[
            {
              id: "a",
              title: "Adrien"
            },
            {
              id: "b",
              title: "Léo"
            },
            {
              id: "c",
              title: "Keny"
            },
            {
              id: "d",
              title: "Paul"
            },
            {
              id: "e",
              title: "Andy"
            }
          ]}
          plugins={[resourceTimeline]}
          schedulerLicenseKey="GPL-My-Project-Is-O  pen-Source"
          weekends={false}
          events={[
            {
              id: 1,
              title: 'jran',
              resourceIds: ['a', 'd'],
              start: '2020-01-28',
              end: '2020-01-30'
            },
            {
              id: 2,
              title: 'lol',
              resourceIds: ['a', 'b'],
              start: '2020-01-27',
              end: '2020-01-28'
            }
          ]}
        />
      </div>
    </div>
  );
}

export default Planning;
