import React, { useState } from "react";
import { data } from "./utils/data"; // Asegúrate de ajustar la ruta
import TaskTable from "./components/taskTable";

const App = () => {
  const [selectedCalendarIds, setSelectedCalendarIds] = useState([]);
  const [selectedListIds, setSelectedListIds] = useState([]);

  const handleSelectCalendar = (id) => {
    setSelectedCalendarIds((prev) =>
      prev.includes(id)
        ? prev.filter((calendarId) => calendarId !== id)
        : [...prev, id]
    );
  };

  const handleSelectList = (id) => {
    setSelectedListIds((prev) =>
      prev.includes(id) ? prev.filter((listId) => listId !== id) : [...prev, id]
    );
  };

  // Filtra los calendarios seleccionados
  const selectedCalendars = data.calendars.filter((calendar) =>
    selectedCalendarIds.includes(calendar.id)
  );

  // Filtra las listas basadas en los calendarios seleccionados
  const filteredLists = selectedCalendars.flatMap((calendar) =>
    calendar.lists.filter((list) => selectedListIds.includes(list.id))
  );

  // Filtra las tareas basadas en las listas seleccionadas
  const filteredTasks = filteredLists.flatMap((list) => list.tasks);

  return (
    <div>
      <div className="flex gap-4 p-4">
        <div className="flex-1">
          <h2>Calendars</h2>
          {data.calendars.map((calendar) => (
            <div key={calendar.id}>
              <input
                type="checkbox"
                id={`calendar-${calendar.id}`}
                checked={selectedCalendarIds.includes(calendar.id)}
                onChange={() => handleSelectCalendar(calendar.id)}
              />
              <label htmlFor={`calendar-${calendar.id}`}>{calendar.name}</label>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <h2>Lists</h2>
          <div>
            {selectedCalendars.flatMap((calendar) =>
              calendar.lists.map((list) => (
                <div key={list.id}>
                  <input
                    type="checkbox"
                    id={`list-${list.id}`}
                    checked={selectedListIds.includes(list.id)}
                    onChange={() => handleSelectList(list.id)}
                  />
                  <label htmlFor={`list-${list.id}`}>{list.name}</label>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <TaskTable tasks={filteredTasks} />
    </div>
  );
};

export default App;
