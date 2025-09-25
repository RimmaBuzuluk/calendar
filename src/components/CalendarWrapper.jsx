import React, { useState, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventModal from "./EventModal";
import "../styles/CalendarWrapper.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarWrapper = () => {
  const [date, setDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: null, end: null });
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const calendarRef = useRef();

  const handleCalendarClick = (e) => {
    if (modalOpen) return;
    if (!calendarRef.current) return;
  
    // перевіряємо, що клік по "тілу" календаря, а не по header
    if (!e.target.closest('.rbc-month-view, .rbc-time-view, .rbc-day-slot, .rbc-time-slot')) {
      return; // якщо клік не по видимій частині календаря, не відкриваємо модалку
    }
  
    const rect = calendarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
  
    const calendarHeight = rect.height;
    const step = 30; // хвилин на один слот
    const totalMinutes = 24 * 60;
    const clickedMinutes = Math.floor((clickY / calendarHeight) * totalMinutes);
    const hour = Math.floor(clickedMinutes / 60);
    const minute = clickedMinutes % 60;
  
    const clickedDate = new Date(date);
    clickedDate.setHours(hour);
    clickedDate.setMinutes(minute);
  
    setNewEvent({
      title: "",
      start: clickedDate,
      end: new Date(clickedDate.getTime() + step * 60000), // +30 хв
    });
  
    setModalPosition({ top: e.clientY, left: e.clientX });
    setModalOpen(true);
  };
  

  const handleSaveEvent = () => {
    if (!newEvent.title) return;
    setEvents([...events, newEvent]);
    setModalOpen(false);
  };

  const handleDiscard = () => {
    setModalOpen(false);
    setNewEvent({ title: "", start: null, end: null });
  };

  const customStyles = {
    content: {
      top: modalPosition.top + "px",
      left: modalPosition.left + "px",
      right: "auto",
      bottom: "auto",
      width: "250px",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  };

  return (
    <div ref={calendarRef} onClick={handleCalendarClick}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={["month", "week", "day", "agenda"]}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        selectable
        now={new Date()}
        step={30}
        scrollToTime={new Date()}
      />

      <EventModal
        isOpen={modalOpen}
        onClose={handleDiscard}
        event={newEvent}
        onSave={handleSaveEvent}
        onChange={setNewEvent}
        ariaHideApp={false}
        customStyles={customStyles}
      />
    </div>
  );
};

export default CalendarWrapper;
