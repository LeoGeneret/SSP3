import React, {useState, useRef, useEffect} from "react";
import "../scss/App.scss";
import FullCalendar from "@fullcalendar/react";
import resourceTimeline from "@fullcalendar/resource-timeline"; 

function Planning() {

  const teamPlanning = useRef(null);

  const [teamPlanningRef, setTeamPlanningRef] = useState(null)
  const [id, setId] = useState('2');
  const [resourceIds, setResourceId] = useState(['a', 'b']);
  const [dateStart, setDateStart] = useState(['']);
  const [dateEnd, setDateEnd] = useState(['']);


  useEffect(() => {
    let calendarApi = teamPlanning.current.getApi();
    setTeamPlanningRef(calendarApi)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    let addedId = id; 
    let addedResourceIds = resourceIds;
    let newDateStart = dateStart;
    let newDateEnd = dateEnd;
   
    console.log(teamPlanningRef);
    
    let newEvent = {title: 'lol', resourceIds: addedResourceIds, start: newDateStart, end: newDateEnd }
    console.log(newEvent);
    

    // teamPlanningRef.addEvent({
    //   title: 'dynamic event',
    //   start: newDateStart,
    //   end: newDateEnd,
    //   resourceIds:  addedResourceIds 
    // })

    teamPlanningRef.addEvent(newEvent)
    
  }

  return (
    <div className="test">
      <h1>PLANNING</h1>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="date" placeholder="Date de début" onChange={e => setDateStart(e.target.value)} />
          <input type="date" placeholder="Date de fin"  onChange={e => setDateEnd(e.target.value)} />
          <button type="submit">Ajouter</button>
        </form>
      </div>
      <div className="calendar-container">
        <FullCalendar
          ref={teamPlanning}
          defaultView="resourceTimelineWeek"
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
              title: "jean"
            }
          ]}
          plugins={[resourceTimeline]}
          schedulerLicenseKey="GPL-My-Project-Is-O  pen-Source"
          weekends={false}
          events={[
            {
              id: "1",
              resourceIds: ["a", "b"],
              title: "Adrien",
              start: "2020-01-27T12:30:00",
              // end: "2020-01-28T07:30:00"
            }
          ]}
        />
      </div>
    </div>
  );
}

export default Planning;
