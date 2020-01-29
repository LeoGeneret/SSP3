import React from "react";
import "../scss/App.scss";
import FullCalendar from '@fullcalendar/react'
import resourceTimeline from '@fullcalendar/resource-timeline'


function Planning() {
  return (
    <div className="test">
      <h1>PLANNING</h1>
      <div className="calendar-container">
        <FullCalendar
          defaultView='resourceTimelineWeek'
          header={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          resources={
            [
              {
                id: 'a',
                title: 'Adrien'
              },
              {
                id: 'b',
                title: 'jean'
              }
            ]
          }
          plugins={[resourceTimeline]}
          schedulerLicenseKey='GPL-My-Project-Is-O  pen-Source'
          weekends={false}
          events={[
            {
              id: '1',
              resourceIds: ['a', 'b'],
              title: 'Adrien',
              start: '2020-01-27T12:30:00',
              end: '2020-01-28T07:30:00'
            },
          ]}
        />
      </div>
    </div>
  );
}

export default Planning;
