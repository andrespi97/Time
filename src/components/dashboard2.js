import React, { useState, useEffect } from "react";
import { useCalendars } from "../utils/firestore/useCalendars";
import AddList from "../utils/firestore/addList";
import AddTask from "../utils/firestore/addTask";
import LogOut from "../utils/logout";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import Table from "./table";
const Dashboard2 = ({ auth }) => {
  const { calendars } = useCalendars({ auth });
  const [selectedLists, setSelectedLists] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks based on selected lists
    console.log("Selected Lists: ", selectedLists);
    const fetchTasks = () => {
      try {
        selectedLists.map((list) => {
          console.log("List Tasks: ", list.tasks);
          list.tasks.map((task) => {
            setTasks((prevTasks) => {
              // Verificar si la tarea ya existe en prevTasks
              const taskExists = prevTasks.some((t) => t.id === task.id);
              // Si no existe, añadirla
              if (!taskExists) {
                return [...prevTasks, task];
              }
              // Si ya existe, retornar prevTasks sin cambios
              return prevTasks;
            });
          });
        });
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };
    fetchTasks();
  }, [selectedLists]);

  const handleCheckboxChange = (list) => {
    setSelectedLists((prev) => {
      // Verificar si la lista ya está en selectedLists
      const isSelected = prev.some((selected) => selected.id === list.id);

      if (isSelected) {
        // Si la lista ya está seleccionada, eliminarla
        return prev.filter((selected) => selected.id !== list.id);
      } else {
        // Si la lista no está seleccionada, añadirla
        return [...prev, list];
      }
    });
  };
  function debug(log) {
    console.log(log);
  }
  return (
    <div className="flex">
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Lists</h2>
        {calendars.map((calendar) => {
          return calendar.lists.map((list) => {
            return (
              <div key={list.id}>
                <label>
                  {list.data.nombre}
                  <input
                    type="checkbox"
                    checked={selectedLists.includes(list)}
                    onChange={handleCheckboxChange}
                  />
                </label>
              </div>
            );
          });
        })}
        <AddList auth={auth} calendars={calendars} />
      </div>
      <div className="w-3/4 p-4">
        <Table
          tasks="tasks"
          setSelectedLists="setSelectedLists"
          setTasks="setTasks"
        />

        <AddTask auth={auth} calendars={calendars} />
      </div>
      <LogOut auth={auth} />
    </div>
  );
};

export default Dashboard2;
