import React, { useState, useEffect } from "react";
import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { data } from "./utils/data";
import TaskTable from "./components/taskTable";
import AuthPage from "./utils/authPage";
import LogOut from "./utils/logout";
import useTasks from "./utils/firestore/useTaks";
const App = () => {
  const [selectedCalendarIds, setSelectedCalendarIds] = useState([]);
  const [selectedListIds, setSelectedListIds] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [calendars, setCalendars] = useState(data.calendars);
  const [lists, setLists] = useState(
    data.calendars.flatMap((calendar) => calendar.lists)
  );
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado

  //tareas database
  const { tareas, loading, error } = useTasks;

  //vigila el estado de user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectCalendar = (id) => {
    setSelectedCalendarIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((calendarId) => calendarId !== id)
        : [...prev, id];

      const selectedCalendars = data.calendars.filter((calendar) =>
        newSelection.includes(calendar.id)
      );
      const filteredLists = selectedCalendars.flatMap((calendar) =>
        calendar.lists.filter((list) => selectedListIds.includes(list.id))
      );
      const updatedTasks = filteredLists.flatMap((list) => list.tasks);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      return newSelection;
    });
  };

  const handleSelectList = (id) => {
    setSelectedListIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((listId) => listId !== id)
        : [...prev, id];

      const selectedCalendars = data.calendars.filter((calendar) =>
        selectedCalendarIds.includes(calendar.id)
      );
      const filteredLists = selectedCalendars.flatMap((calendar) =>
        calendar.lists.filter((list) => newSelection.includes(list.id))
      );
      const updatedTasks = filteredLists.flatMap((list) => list.tasks);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      return newSelection;
    });
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const filterTasks = (criteria) => {
    const now = new Date();
    let startOfWeek, endOfWeek, startOfNextWeek, endOfNextWeek;

    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    now.setDate(now.getDate() - now.getDay() + 1); // Ajustar al inicio de la semana
    startOfWeek = new Date(now.setHours(0, 0, 0, 0));
    endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate() + 1);
    endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    let filtered;

    switch (criteria) {
      case "today":
        filtered = tasks.filter((task) => {
          const deadline = new Date(task.deadline);
          return deadline <= startOfToday; // Muestra hoy y anteriores
        });
        break;
      case "tomorrow":
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfToday.getDate() + 1);
        filtered = tasks.filter((task) => {
          const deadline = new Date(task.deadline);
          return deadline <= startOfTomorrow; // Muestra mañana y anteriores
        });
        break;
      case "withinWeek":
        filtered = tasks.filter((task) => {
          const deadline = new Date(task.deadline);
          return deadline <= endOfWeek; // Muestra esta semana y anteriores
        });
        break;
      case "nextWeek":
        filtered = tasks.filter((task) => {
          const deadline = new Date(task.deadline);
          return deadline >= startOfNextWeek && deadline <= endOfNextWeek; // Muestra solo la próxima semana
        });
        break;
      default:
        filtered = tasks;
    }

    setFilteredTasks(filtered);
  };

  const handleSelectAll = () => {
    const allCalendarIds = data.calendars.map((calendar) => calendar.id);
    setSelectedCalendarIds(allCalendarIds);

    const allLists = data.calendars.flatMap((calendar) => calendar.lists);
    const allListIds = allLists.map((list) => list.id);
    setSelectedListIds(allListIds);

    const filteredLists = data.calendars.flatMap((calendar) =>
      calendar.lists.filter((list) => allListIds.includes(list.id))
    );
    const updatedTasks = filteredLists.flatMap((list) => list.tasks);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
  };

  const handleClearFilters = () => {
    setFilteredTasks(tasks); // quita filtros de tiempo
  };

  return (
    <div>
      {user ? (
        <>
          <div className="flex gap-4 p-4">
            <button onClick={handleSelectAll}>
              Select All Calendars and Lists
            </button>
          </div>
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
                  <label htmlFor={`calendar-${calendar.id}`}>
                    {calendar.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex-1">
              <h2>Lists</h2>
              <div>
                {data.calendars
                  .flatMap((calendar) =>
                    calendar.lists.filter((list) =>
                      selectedCalendarIds.includes(calendar.id)
                    )
                  )
                  .map((list) => (
                    <div key={list.id}>
                      <input
                        type="checkbox"
                        id={`list-${list.id}`}
                        checked={selectedListIds.includes(list.id)}
                        onChange={() => handleSelectList(list.id)}
                      />
                      <label htmlFor={`list-${list.id}`}>{list.name}</label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 p-4">
            <button onClick={() => filterTasks("today")}>
              Tasks Due Today
            </button>
            <button onClick={() => filterTasks("tomorrow")}>
              Tasks Due Tomorrow or Earlier
            </button>
            <button onClick={() => filterTasks("withinWeek")}>
              Tasks Due This Week or Earlier
            </button>
            <button onClick={() => filterTasks("nextWeek")}>
              Tasks Due Next Week
            </button>
            <button onClick={handleClearFilters}>Clear Filters</button>
          </div>
          <TaskTable
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
          />
          <LogOut auth={auth} />
        </>
      ) : (
        <AuthPage />
      )}
    </div>
  );
};

export default App;
