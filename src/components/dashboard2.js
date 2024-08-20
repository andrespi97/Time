import React, { useState, useEffect } from "react";
import { useCalendars } from "../utils/firestore/useCalendars";
import AddList from "../utils/firestore/addList";
import AddTask from "../utils/firestore/addTask";
import LogOut from "../utils/logout";
import { writeBatch, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

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
                    checked={selectedLists.some(
                      (selected) => selected.id === list.id
                    )}
                    onChange={() => handleCheckboxChange(list)}
                  />
                </label>
              </div>
            );
          });
        })}
        <AddList auth={auth} calendars={calendars} />
      </div>
      <div className="w-3/4 p-4">
        <button onClick={commitBatch}>Save Changes</button>
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
                  className="border p-2 cursor-pointer"
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
            {console.log(tasks)}
            {tasks.map((task) => (
              <tr key={task.id}>
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
                    className="border p-2"
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
                          ); // Handle the timeout on each change
                        }}
                        onBlur={handleEditSave}
                        autoFocus
                        onKeyDown={handleKeyDown}
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

        <AddTask auth={auth} calendars={calendars} />
      </div>
      <LogOut auth={auth} />
    </div>
  );
};

export default Dashboard2;
