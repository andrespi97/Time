import React from "react";

const Sidebar = ({ calendars, onSelectCalendar, selectedCalendarIds }) => {
  return (
    <div className="sidebar">
      <h2>Calendars</h2>
      <ul>
        {calendars.map((calendar) => (
          <li key={calendar.id} className="py-2 flex items-center">
            <input
              type="checkbox"
              id={calendar.id}
              checked={selectedCalendarIds.includes(calendar.id)}
              onChange={() => onSelectCalendar(calendar.id)}
              className="mr-2"
            />
            <label
              htmlFor={calendar.id}
              className="cursor-pointer hover:underline"
            >
              <div style={{ backgroundColor: calendar.color }}>
                {calendar.name}
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
