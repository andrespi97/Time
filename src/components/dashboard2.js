import React, { useState, useEffect } from "react";
import { useCalendars } from "../utils/firestore/useCalendars";
import { db } from "../utils/firebase";
import Todolist from "./todolist";

const Dashboard2 = ({ auth }) => {
  const { calendars } = useCalendars({ auth });
  const [selectedLists, setSelectedLists] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = () => {
      try {
        const updatedTasks = selectedLists.reduce((acc, list) => {
          // Combina las tareas de todas las listas seleccionadas
          return [...acc, ...list.tasks];
        }, []);

        // Filtra tareas duplicadas por ID
        const uniqueTasks = updatedTasks.filter(
          (task, index, self) =>
            index === self.findIndex((t) => t.id === task.id)
        );

        setTasks(uniqueTasks);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [selectedLists]);

  const listOfTask = (taskId, selectedLists) => {
    for (const list of selectedLists) {
      const foundTask = list.tasks.find((task) => task.id === taskId);
      if (foundTask) {
        return list.id; // Devuelve el ID de la lista que contiene la tarea
      }
    }
    return null; // Si no se encuentra la tarea, devuelve null
  };
  const calendarOfList = (listId) => {
    for (const calendar of calendars) {
      const foundCalendar = calendar.lists.find((list) => list.id === listId);
      if (foundCalendar) {
        return calendar.id; // Devuelve el ID de la lista que contiene la tarea
      }
    }
    return null; // Si no se encuentra la tarea, devuelve null
  };
  return (
    <>
      <div className="flex h-screen z-10">
        <Todolist
          auth={auth}
          tasks={tasks}
          setTasks={setTasks}
          selectedLists={selectedLists}
          setSelectedLists={setSelectedLists}
          db={db}
          listOfTask={listOfTask}
          calendarOfList={calendarOfList}
        />
      </div>
    </>
  );
};

export default Dashboard2;
