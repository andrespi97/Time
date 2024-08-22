import React, { useState, useEffect } from "react";
import { useCalendars } from "../utils/firestore/useCalendars";
import AddList from "../utils/firestore/addList";
import AddTask from "../utils/firestore/addTask";
import LogOut from "../utils/logout";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { ToggleButton } from "primereact/togglebutton";
import Sidebar from "./sidebar";
import TaskTable from "./taskTable";

const Dashboard2 = ({ auth }) => {
  const { calendars } = useCalendars({ auth });
  const [selectedLists, setSelectedLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [lote, setLote] = useState(writeBatch(db));
  const [timeoutId, setTimeoutId] = useState(null);
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

  const handleCheckboxChange = (list) => {
    setSelectedLists((prev) => {
      const isSelected = prev.some((selected) => selected.id === list.id);
      if (isSelected) {
        return prev.filter((selected) => selected.id !== list.id);
      } else {
        return [...prev, list];
      }
    });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setTasks(sortedTasks);
  };

  const handleCellEdit = (taskId, column, value) => {
    setEditingCell({ taskId, column });
    setEditValue(value);
    // Clear existing timeout if any
    if (timeoutId) clearTimeout(timeoutId);

    // Set a timeout to auto-save after 5 seconds
    const id = setTimeout(() => {
      handleEditSave();
      commitBatch();
      setLote(writeBatch(db));
    }, 5000);
    setTimeoutId(id);
  };
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
  const handleEditSave = async () => {
    const batch = lote;
    if (!editingCell) return;
    const lista = listOfTask(editingCell.taskId, selectedLists);
    const calendario = calendarOfList(lista);
    if (calendario && lista) {
      const guardarTask = doc(
        db,
        "calendars",
        calendario,
        "lists",
        lista,
        "tasks",
        editingCell.taskId
      );
      try {
        // Actualizar el valor en Firestore
        console.log(batch);

        batch.update(guardarTask, { [editingCell.column]: editValue });
        console.log(batch);
        setLote(batch);
        // Actualizar el valor en el estado local
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingCell.taskId
              ? {
                  ...task,
                  data: {
                    ...task.data,
                    [editingCell.column]: editValue,
                  },
                }
              : task
          )
        );
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }

    setEditingCell(null);
    setEditValue("");
  };

  const commitBatch = async () => {
    const batch = lote;
    await batch
      .commit()
      .then(() => {
        console.log("Todos los documentos se actualizaron correctamente.");
      })
      .catch((error) => {
        console.error("Error al actualizar los documentos: ", error);
      });
    setLote(writeBatch(db));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditSave();
    }
  };

  return (
    <div className="flex h-screen z-10">
      <Sidebar auth={auth} />
      {/* Sidebar */}

      <div className="w-1/6 bg-gray-200 p-6 border-r">
        <h2 className=" font-bold mb-4">Lists</h2>
        <div className="space-y-2">
          {calendars.map((calendar) =>
            calendar.lists.map((list) => (
              <div key={list.id} className="flex">
                {/* este div es prime react */}
                <div className="card flex justify-content-center">
                  <ToggleButton
                    onLabel={list.data.nombre}
                    offLabel={list.data.nombre}
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    checked={selectedLists.some(
                      (selected) => selected.id === list.id
                    )}
                    onChange={() => handleCheckboxChange(list)}
                    className="w-9rem truncate w-48"
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <AddList auth={auth} calendars={calendars} />
        </div>
      </div>
      <TaskTable tasks={tasks} />
      {/* Main Content */}
      <div className="w-5/6 flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <button
            onClick={commitBatch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                "status",
                "name",
                "category",
                "deadline",
                "dependencies",
                "duration",
                "plannedDate",
                "priority",
                "reoccurence",
                "wantedDate",
              ].map((column) => (
                <th
                  key={column}
                  className="border p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column)}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  {sortColumn === column &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className={`border-b hover:bg-gray-100 ${
                  editingCell?.taskId === task.id ? "bg-gray-200" : ""
                }`}
              >
                {[
                  "status",
                  "name",
                  "category",
                  "deadline",
                  "dependencies",
                  "duration",
                  "plannedDate",
                  "priority",
                  "reoccurence",
                  "wantedDate",
                ].map((column) => (
                  <td
                    key={`${task.id}-${column}`}
                    className="p-2 cursor-pointer"
                    onClick={() =>
                      handleCellEdit(task.id, column, task.data[column])
                    }
                  >
                    {editingCell?.taskId === task.id &&
                    editingCell?.column === column ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => {
                          setEditValue(e.target.value);
                          handleCellEdit(
                            editingCell.taskId,
                            editingCell.column,
                            e.target.value
                          );
                        }}
                        onBlur={handleEditSave}
                        autoFocus
                        onKeyDown={handleKeyDown}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      task.data[column]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <AddTask
            auth={auth}
            calendars={calendars}
            setTasks={setTasks}
            tasks={tasks}
          />
        </div>
      </div>
      <div className="p-6">
        <LogOut auth={auth} />
      </div>
    </div>
  );
};

export default Dashboard2;
