import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";

function Calendar({ data }) {
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 500) {
      setAlert(true);
    }
  }, []);
  const events = data.map((item) => ({
    title: item.FirstName + " " + item.LastName + " (" + item.TDate + " Leave)",
    initialView: "dayGridMonth",
    start: item.FDate,
    end: new Date(new Date(item.LDate).getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    color: "rgb(193, 255, 177)",
  }));

  useEffect(() => {
    window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1000);
  });

  return (
    <div>
      {!alert && (
        <div className="Calender">
          <FullCalendar
            plugins={[dayGridPlugin, listPlugin, multiMonthPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "prev,next,today",
              center: "title",
              end: "dayGridMonth,multiMonthYear,listWeek",
            }}
            events={events}
            weekends={false}
          />
        </div>
      )}
      {alert && (
        <div
          className="alert alert-warning"
          style={{ margin: "8rem 0rem " }}
          role="alert"
        >
          The calendar will be visible in desktop view.
        </div>
      )}
    </div>
  );
}

export default Calendar;
