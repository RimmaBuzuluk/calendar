import React, { useState } from "react";
import Modal from "react-modal";
import { format } from "date-fns";
import "../styles/EventModal.css";

// ВАЖЛИВО: вкажемо appElement один раз
Modal.setAppElement("#root");

const EventModal = ({ isOpen, onClose, event, onSave, onChange, customStyles}) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="event-modal-content"
      overlayClassName="event-modal-overlay"
      contentLabel="Add Event"
      style={customStyles} 
    >
      <div className="event-modal-header">
        <h3>Нова подія</h3>
        <button onClick={onClose} className="event-modal-close">✖</button>
      </div>

      <p>
        <strong>Дата:</strong>{" "}
        {event.start ? format(event.start, "yyyy-MM-dd") : "-"}
      </p>
      <p>
        <strong>Час:</strong>{" "}
        {event.start ? format(event.start, "HH:mm") : "-"} -{" "}
        {event.end ? format(event.end, "HH:mm") : "-"}
      </p>

      <input
        type="text"
        placeholder="Назва події"
        value={event.title}
        onChange={(e) => onChange({ ...event, title: e.target.value })}
        className="event-modal-input"
      />

      <div className="event-modal-buttons">
        <button onClick={onClose}>Discard</button>
        <button onClick={onSave}>Save</button>
      </div>
    </Modal>
  );
};

export default EventModal;
